import { app } from './src/app.ts'

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // 1. 获取用户提供的 Key (优先从 Header 获取，其次从 URL 参数获取)
    const userKey = request.headers.get("x-api-key") || url.searchParams.get("api_key");

    // 2. 校验逻辑
    // 请确保你在 Cloudflare Workers 的设置界面中添加了名为 AUTH_KEY 的环境变量
    if (!env.AUTH_KEY || userKey !== env.AUTH_KEY) {
      return new Response(
        JSON.stringify({ 
          code: 401, 
          msg: "未授权：请在 Header 中添加 x-api-key 或在 URL 中添加 api_key 参数" 
        }),
        { 
          status: 401, 
          headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*" // 保持跨域友好
          } 
        }
      );
    }

    // 3. 校验通过，执行原有的应用逻辑
    // 注意：这里使用的是原代码中的 { app }
    return app.fetch(request, env, ctx);
  },
};
