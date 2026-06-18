const express = require('express');
const router = express.Router();
const { tasks, runs } = require('@trigger.dev/sdk/v3');

async function triggerAndPoll(taskName, payload) {
  const handle = await tasks.trigger(taskName, payload);
  let run = await runs.retrieve(handle.id);
  
  while (run.status === 'QUEUED' || run.status === 'EXECUTING') {
    await new Promise(r => setTimeout(r, 1000));
    run = await runs.retrieve(handle.id);
  }
  
  if (run.status === 'COMPLETED') {
    return run.output?.text || run.output?.url || run.output;
  }
  
  throw new Error(`Task failed with status: ${run.status}`);
}

router.post('/:workflowId', async (req, res) => {
  const { workflowId } = req.params;
  const nodes = req.body;

  try {
    const promises = nodes.map(async (node) => {
      let output = null;
      
      if (node.type === 'cropImage') {
        const payload = {
          imageUrl: node.data?.imageUrl || '',
          x: node.data?.x || 0,
          y: node.data?.y || 0,
          width: node.data?.width || 100,
          height: node.data?.height || 100
        };
        output = await triggerAndPoll("crop-image", payload);
      } 
      else if (node.type === 'geminiPro') {
        const payload = {
          prompt: node.data?.prompt || '',
          systemPrompt: node.data?.systemPrompt || '',
          imageUrl: node.data?.imageUrl || ''
        };
        output = await triggerAndPoll("gemini-pro", payload);
      }
      
      return {
        nodeId: node.id,
        output
      };
    });

    const results = await Promise.all(promises);
    
    res.json({
      workflowId,
      executions: results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
