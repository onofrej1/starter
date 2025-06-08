import { resources } from "@/resources";
import { replaceInFileSync } from "replace-in-file";
import fs from 'fs-extra';
import path from 'path';

const generateApi = (resource: string, model: string) => {
  const templatePath = path.join(__dirname, "generator", "templates");
  const destinationPath = path.join(
    process.cwd(),
    "app",
    "api",
    "resources",
    resource
  );

  console.log(`Generating api for "${model}" model:`);
  fs.copySync(templatePath, destinationPath);

  replaceInFileSync({
    files: path.join(destinationPath, "**", "*"),
    from: /\[MODEL\]/g,
    to: model,
  });
};

const defaultModels = [{ model: "user", resource: "users", relations: [] }];

for (const model of [...resources, ...defaultModels]) {
  generateApi(model.resource, model.model);
}
