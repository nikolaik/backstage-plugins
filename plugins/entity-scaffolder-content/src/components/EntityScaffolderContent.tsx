import React, { useMemo, useState } from 'react';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import {
  SecretsContextProvider,
  TemplateGroupFilter,
} from '@backstage/plugin-scaffolder-react';
import { TemplateGroups } from '@backstage/plugin-scaffolder-react/alpha';
import { EmbeddedScaffolderWorkflow } from '@frontside/backstage-plugin-scaffolder-workflow';
import { Button } from '@material-ui/core';
import { TemplateListProvider } from './TemplateListProvider';
import type { JsonValue } from '@backstage/types';

type TemplateGroupFilterWithEntityCapture = {
  title?: React.ReactNode;
  filter: (entity: Entity, template: TemplateEntityV1beta3) => boolean;
};

export type EntityScaffolderContentProps = {
  // Filter which template groups should display for the selected entity
  templateGroupFilters: TemplateGroupFilterWithEntityCapture[];
  // Build the initial state (form values) for the embedded scaffolder workflow
  //
  // For example, if your template has a "component" input, this can be:
  // (entity) => ({ component: stringifyEntityRef(entity) })
  buildInitialState: (entity: Entity) => Record<string, JsonValue>;
};

/**
 * Use Templates from within the EntityPage.
 *
 * @public
 */
export const EntityScaffolderContent = ({
  templateGroupFilters,
  buildInitialState,
}: EntityScaffolderContentProps) => {
  const { entity } = useEntity();
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateEntityV1beta3 | null>(null);
  const groupFilters: TemplateGroupFilter[] = useMemo(() => {
    return templateGroupFilters.map(({ title, filter }) => ({
      title,
      filter: (template: TemplateEntityV1beta3) => filter(entity, template),
    }));
  }, [templateGroupFilters, entity]);
  return (
    <SecretsContextProvider>
      <TemplateListProvider>
        {selectedTemplate ? (
          <>
            <EmbeddedScaffolderWorkflow
              namespace={selectedTemplate.metadata.namespace || 'default'}
              templateName={selectedTemplate.metadata.name}
              initialState={buildInitialState(entity)}
              onError={(error: Error | undefined) => (
                <h2>{error?.message ?? 'Error running workflow'}</h2>
              )}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSelectedTemplate(null)}
            >
              View All Templates
            </Button>
          </>
        ) : (
          <TemplateGroups
            groups={groupFilters}
            onTemplateSelected={setSelectedTemplate}
          />
        )}
      </TemplateListProvider>
    </SecretsContextProvider>
  );
};
