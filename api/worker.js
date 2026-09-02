/**
 * Serverless Worker Function (Deployed to Vercel / Edge)
 * Triggered asynchronously by QStash message dispatcher
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { taskId, type, payload } = req.body || {};
  const startTime = Date.now();

  try {
    console.log(`[Cloud Serverless Worker] Processing task ${taskId} (Type: ${type})`);

    // Simulated cloud worker processing logic
    let result = { status: 'COMPLETED', timestamp: new Date().toISOString() };
    
    if (type === 'pdf_generator') {
      result.message = 'PDF generated successfully via serverless microVM';
    } else if (type === 'image_processor') {
      result.message = 'Image compressed and filtered via cloud edge';
    } else {
      result.message = 'Data processed successfully';
    }

    const duration = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      taskId,
      durationMs: duration,
      result
    });
  } catch (error) {
    console.error(`[Worker Error] Task ${taskId} failed:`, error);
    return res.status(500).json({
      success: false,
      taskId,
      error: error.message
    });
  }
}
