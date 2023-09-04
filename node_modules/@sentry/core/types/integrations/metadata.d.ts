import type { EventProcessor, Hub, Integration } from '@sentry/types';
/**
 * Adds module metadata to stack frames.
 *
 * Metadata can be injected by the Sentry bundler plugins using the `_experiments.moduleMetadata` config option.
 *
 * When this integration is added, the metadata passed to the bundler plugin is added to the stack frames of all events
 * under the `module_metadata` property. This can be used to help in tagging or routing of events from different teams
 * our sources
 */
export declare class ModuleMetadata implements Integration {
    static id: string;
    /**
     * @inheritDoc
     */
    name: string;
    constructor();
    /**
     * @inheritDoc
     */
    setupOnce(addGlobalEventProcessor: (processor: EventProcessor) => void, getCurrentHub: () => Hub): void;
}
//# sourceMappingURL=metadata.d.ts.map