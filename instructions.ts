import { ApplicationContract } from "@ioc:Adonis/Core/Application";
import * as sinkStatic from "@adonisjs/sink";
import { join } from "path";

/**
 * Instructions to be executed when setting up the package.
 */
export default async function instructions(
  projectRoot: string,
  app: ApplicationContract,
  sink: typeof sinkStatic
) {
  const apolloPath = join(app.directoriesMap.get("start")!, "apollo.ts");
  const template = new sink.files.MustacheFile(
    projectRoot,
    apolloPath,
    join(__dirname, "templates", "apollo.ts.txt")
  );

  if (template.exists()) {
    sink.logger.action("create").skipped(`${apolloPath} file already exists`);
    return;
  }

  template.apply().commit();
  sink.logger.action("create").succeeded(apolloPath);
}
