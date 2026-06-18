const express = require('express');
const router = express.Router();
const { tasks } = require('@trigger.dev/sdk/v3');

router.post('/:workflowId', async (req, res) => {
  const { workflowId } = req.params;
  const nodes = req.body;

  try {
    const promises = nodes.map(async (node) => {
      let runId = null;
      
      if (node.type === 'cropImage') {
        const payload = {
          imageUrl: node.data?.imageUrl || '',
          x: node.data?.x || 0,
          y: node.data?.y || 0,
          width: node.data?.width || 100,
          height: node.data?.height || 100
        };
        const handle = await tasks.trigger("crop-image", payload);
        runId = handle.id;
      } 
      else if (node.type === 'geminiPro') {
        const payload = {
          prompt: node.data?.prompt || '',
          systemPrompt: node.data?.systemPrompt || '',
          imageUrl: node.data?.imageUrl || ''
        };
        const handle = await tasks.trigger("gemini-pro", payload);
        runId = handle.id;
      }
      
      return {
        nodeId: node.id,
        runId
      };
    });

    const results = await Promise.all(promises);
    
    res.json({
      workflowId,
      executions: results.filter(r => r.runId !== null)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
