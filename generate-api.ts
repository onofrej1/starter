import { replaceInFileSync } from "replace-in-file";
import fs from "fs-extra";
import path from "path";

const generateApi = (name: string, table: string) => {
  const templatePath = path.join(__dirname, "generator", "templates");
  const destinationPath = path.join(process.cwd(), "services");

  console.log(`Generating api for "${name}" resource:`);
  fs.copySync(templatePath, destinationPath);

  fs.rename(
    path.join(destinationPath, "service.ts.tpl"),
    path.join(destinationPath, name + ".ts")
  );

  replaceInFileSync({
    files: path.join(destinationPath, "**", "*"),
    from: /\[TABLE\]/g,
    to: table,
  });

  replaceInFileSync({
    files: path.join(destinationPath, "**", "*"),
    from: /\[NAME\]/g,
    to: name,
  });
};

//const defaultModels = [{ model: "user", resource: "users", relations: [] }];

const models = [
  { name: 'category', table: 'categories' },
  { name: "tag", table: "tags" },
  { name: "post", table: "posts" },
];
for (const model of [...models /*, ...defaultModels*/]) {
  generateApi(model.name, model.table);
}
