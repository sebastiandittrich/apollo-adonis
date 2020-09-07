import { join } from 'path'
import { BaseCommand, args } from '@adonisjs/ace'

export default class MakeModel extends BaseCommand {
	public static commandName = 'make:resolver'
	public static description = 'Make a new GraphQl Resolver'

	/**
	 * The name of the resolver file.
	 */
	@args.string({ description: 'Name of the Resolver' })
	public name: string

	/**
	 * Execute command
	 */
	public async handle(): Promise<void> {
		
		const stub = join(__dirname.split('/').filter(name => name != 'build').join('/'), '..', 'templates', 'resolver.txt')
		
		const path = this.application.resolveNamespaceDirectory('graphqlControllers')

		this.generator
			.addFile(this.name, { pattern: 'pascalcase', form: 'singular', suffix: 'Resolver' })
			.stub(stub)
			.destinationDir(path || 'app/Controllers/GraphQl')
			.useMustache()
			.appRoot(this.application.cliCwd || this.application.appRoot)

		await this.generator.run()
	}
}