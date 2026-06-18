const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  try {
    await pool.query('BEGIN');

    const userId = 'test_user_' + Date.now();
    await pool.query(
      'INSERT INTO users (clerk_id, email) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, 'test@example.com']
    );

    const workflowRes = await pool.query(
      'INSERT INTO workflows (name, user_id, status) VALUES ($1, $2, $3) RETURNING id',
      ['Trial Task Workflow', userId, 'draft']
    );
    const workflowId = workflowRes.rows[0].id;

    const nodes = [
      { id: 'request-inputs-1', type: 'requestInputs', x: 100, y: 300, data: { fields: [{id: 'text1', type: 'text_field', label: 'Text Input'}, {id: 'img1', type: 'image_field', label: 'Image Input'}, {id: 'img2', type: 'image_field', label: 'Image Input'}] } },
      { id: 'crop-1', type: 'cropImage', x: 400, y: 150, data: { x: 10, y: 10, width: 80, height: 80 } },
      { id: 'crop-2', type: 'cropImage', x: 400, y: 450, data: { x: 20, y: 20, width: 60, height: 60 } },
      { id: 'gemini-1', type: 'geminiPro', x: 400, y: 750, data: {} },
      { id: 'gemini-2', type: 'geminiPro', x: 700, y: 750, data: {} },
      { id: 'gemini-3', type: 'geminiPro', x: 1000, y: 450, data: {} },
      { id: 'response-1', type: 'responseNode', x: 1300, y: 450, data: {} }
    ];

    for (const node of nodes) {
      await pool.query(
        'INSERT INTO nodes (id, workflow_id, type, position_x, position_y, data) VALUES ($1, $2, $3, $4, $5, $6)',
        [node.id, workflowId, node.type, node.x, node.y, JSON.stringify(node.data)]
      );
    }

    const edges = [
      { id: 'e1', source: 'request-inputs-1', target: 'crop-1', sourceHandle: 'img1', targetHandle: 'input-image' },
      { id: 'e2', source: 'request-inputs-1', target: 'crop-2', sourceHandle: 'img2', targetHandle: 'input-image' },
      { id: 'e3', source: 'request-inputs-1', target: 'gemini-1', sourceHandle: 'text1', targetHandle: 'prompt' },
      
      { id: 'e4', source: 'gemini-1', target: 'gemini-2', sourceHandle: 'output', targetHandle: 'prompt' },
      
      { id: 'e5', source: 'crop-1', target: 'gemini-3', sourceHandle: 'output-image', targetHandle: 'image--vision-' },
      { id: 'e6', source: 'crop-2', target: 'gemini-3', sourceHandle: 'output-image', targetHandle: 'image--vision-' },
      { id: 'e7', source: 'gemini-2', target: 'gemini-3', sourceHandle: 'output', targetHandle: 'prompt' },
      
      { id: 'e8', source: 'gemini-3', target: 'response-1', sourceHandle: 'output', targetHandle: 'input' }
    ];

    for (const edge of edges) {
      await pool.query(
        'INSERT INTO edges (id, workflow_id, source, target, source_handle, target_handle) VALUES ($1, $2, $3, $4, $5, $6)',
        [edge.id, workflowId, edge.source, edge.target, edge.sourceHandle, edge.targetHandle]
      );
    }

    await pool.query('COMMIT');
    console.log('Successfully seeded Trial Task Workflow. Workflow ID:', workflowId);
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Failed to seed:', err);
  } finally {
    pool.end();
  }
}

seed();
