import { task } from "@trigger.dev/sdk/v3";
import Transloadit from "transloadit";

const transloadit = new Transloadit({
  authKey: process.env.TRANSLOADIT_AUTH_KEY,
  authSecret: process.env.TRANSLOADIT_AUTH_SECRET,
});

export const cropImageTask = task({
  id: "crop-image",
  run: async (payload) => {
    const { imageUrl, x, y, width, height } = payload;
    
    await new Promise(r => setTimeout(r, 30000));
    
    const options = {
      params: {
        steps: {
          import: {
            robot: "/http/import",
            url: imageUrl,
          },
          crop: {
            use: "import",
            robot: "/image/resize",
            crop: {
              x: `${x}%`,
              y: `${y}%`,
              width: `${width}%`,
              height: `${height}%`,
            },
            imagemagick_stack: "v2.0.0",
          },
        },
      },
    };

    const status = await transloadit.createAssembly(options);
    
    return {
      croppedImageUrl: status.results.crop ? status.results.crop[0].ssl_url : null,
    };
  },
});
