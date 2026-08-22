/**
 * File ini HANYA diimport di mode development (import.meta.env.DEV).
 * Tidak akan masuk ke production bundle.
 */
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'

export const AppDevtools = () => (
  <TanStackDevtools
    config={{
      position: 'bottom-right',
    }}
    plugins={[
      {
        name: 'Tanstack Router',
        render: <TanStackRouterDevtoolsPanel />,
      },
      {
        name: 'Tanstack Query',
        render: <ReactQueryDevtoolsPanel />,
      },
    ]}
  />
)
