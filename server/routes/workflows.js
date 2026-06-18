const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM workflows ORDER BY updated_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId) throw new Error("Missing userId");

    await db.query(
      'INSERT INTO users (clerk_id, email) VALUES ($1, $2) ON CONFLICT (clerk_id) DO NOTHING',
      [userId, 'auto@example.com']
    );

    const { rows } = await db.query(
      "INSERT INTO workflows (name, user_id, status) VALUES ($1, $2, 'draft') RETURNING *",
      ['Untitled Workflow', userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Workflow Creation Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const workflowResult = await db.query('SELECT * FROM workflows WHERE id = $1', [id]);
    if (workflowResult.rows.length === 0) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    const nodesResult = await db.query('SELECT * FROM nodes WHERE workflow_id = $1', [id]);
    const edgesResult = await db.query('SELECT * FROM edges WHERE workflow_id = $1', [id]);
    
    res.json({
      ...workflowResult.rows[0],
      nodes: nodesResult.rows.map(n => ({
        id: n.id,
        type: n.type,
        position: { x: n.position_x, y: n.position_y },
        data: n.data || {}
      })),
      edges: edgesResult.rows.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.source_handle,
        targetHandle: e.target_handle
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/save', async (req, res) => {
  const { id } = req.params;
  const { nodes, edges } = req.body;

  try {
    await db.query('BEGIN');
    
    await db.query('UPDATE workflows SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);
    
    await db.query('DELETE FROM nodes WHERE workflow_id = $1', [id]);
    if (nodes && nodes.length > 0) {
      for (const node of nodes) {
        await db.query(
          'INSERT INTO nodes (id, workflow_id, type, position_x, position_y, data) VALUES ($1, $2, $3, $4, $5, $6)',
          [node.id, id, node.type, node.position.x, node.position.y, node.data]
        );
      }
    }
    
    await db.query('DELETE FROM edges WHERE workflow_id = $1', [id]);
    if (edges && edges.length > 0) {
      for (const edge of edges) {
        await db.query(
          'INSERT INTO edges (id, workflow_id, source, target, source_handle, target_handle) VALUES ($1, $2, $3, $4, $5, $6)',
          [edge.id, id, edge.source, edge.target, edge.sourceHandle, edge.targetHandle]
        );
      }
    }

    await db.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

router.get('/history/all', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM run_history ORDER BY started_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
