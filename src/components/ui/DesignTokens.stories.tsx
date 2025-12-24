import type { Story } from '@ladle/react'

export default {
  title: 'Design System',
}

const ColorSwatch = ({
  name,
  variable,
  className,
}: {
  name: string
  variable: string
  className: string
}) => (
  <div className="flex items-center gap-4">
    <div className={`w-16 h-16 rounded-lg border border-border ${className}`} />
    <div>
      <div className="font-heading text-sm">{name}</div>
      <code className="text-xs text-muted-foreground">{variable}</code>
    </div>
  </div>
)

export const ColorPalette: Story = () => (
  <div className="space-y-8">
    <div>
      <h2 className="font-heading text-xl mb-4">Background Colors</h2>
      <div className="grid grid-cols-2 gap-4">
        <ColorSwatch name="Primary" variable="--color-bg-primary" className="bg-background" />
        <ColorSwatch name="Surface" variable="--color-bg-surface" className="bg-card" />
        <ColorSwatch name="Alt" variable="--color-bg-alt" className="bg-muted" />
        <ColorSwatch
          name="Elevated"
          variable="--color-bg-elevated"
          className="bg-[var(--color-bg-elevated)]"
        />
      </div>
    </div>

    <div>
      <h2 className="font-heading text-xl mb-4">Accent Colors</h2>
      <div className="grid grid-cols-2 gap-4">
        <ColorSwatch
          name="Primary (White)"
          variable="--color-accent-primary"
          className="bg-accent"
        />
        <ColorSwatch
          name="Secondary (Gray)"
          variable="--color-accent-secondary"
          className="bg-accent-secondary"
        />
      </div>
    </div>

    <div>
      <h2 className="font-heading text-xl mb-4">Text Colors</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <span className="text-foreground font-medium w-32">Primary</span>
          <code className="text-xs text-muted-foreground">--color-text-primary (#fafafa)</code>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground font-medium w-32">Secondary</span>
          <code className="text-xs text-muted-foreground">--color-text-secondary (#a1a1aa)</code>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[var(--color-text-muted)] font-medium w-32">Muted</span>
          <code className="text-xs text-muted-foreground">--color-text-muted (#71717a)</code>
        </div>
      </div>
    </div>
  </div>
)

export const Typography: Story = () => (
  <div className="space-y-8">
    <div>
      <h2 className="font-heading text-xl mb-4">Font Families</h2>
      <div className="space-y-6">
        <div>
          <div className="font-heading text-2xl mb-1">JetBrains Mono</div>
          <p className="text-muted-foreground text-sm mb-2">
            Used for headings and monospace code. Applied via{' '}
            <code className="text-accent-secondary">font-heading</code> or{' '}
            <code className="text-accent-secondary">font-mono</code>
          </p>
          <div className="font-heading text-lg">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
          <div className="font-heading text-lg">abcdefghijklmnopqrstuvwxyz</div>
          <div className="font-heading text-lg">0123456789</div>
        </div>
        <div>
          <div className="font-sans text-2xl mb-1">Inter</div>
          <p className="text-muted-foreground text-sm mb-2">
            Used for body text and UI. Applied via{' '}
            <code className="text-accent-secondary">font-sans</code>
          </p>
          <div className="font-sans text-lg">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
          <div className="font-sans text-lg">abcdefghijklmnopqrstuvwxyz</div>
          <div className="font-sans text-lg">0123456789</div>
        </div>
      </div>
    </div>

    <div>
      <h2 className="font-heading text-xl mb-4">Heading Hierarchy</h2>
      <div className="space-y-3">
        <div className="font-heading text-4xl uppercase tracking-tight">H1 / 3XL - 48px</div>
        <div className="font-heading text-3xl uppercase tracking-tight">H2 / 2XL - 36px</div>
        <div className="font-heading text-2xl uppercase tracking-tight">H3 / XL - 30px</div>
        <div className="font-heading text-xl uppercase tracking-tight">H4 / LG - 24px</div>
        <div className="font-heading text-lg uppercase tracking-tight">H5 / MD - 18px</div>
        <div className="font-heading text-base uppercase tracking-tight">H6 / SM - 16px</div>
      </div>
    </div>

    <div>
      <h2 className="font-heading text-xl mb-4">Body Text</h2>
      <div className="space-y-3 max-w-lg">
        <p className="text-lg">Large (18px) - Used for lead paragraphs and emphasis</p>
        <p className="text-base">Base (16px) - Default body text size for comfortable reading</p>
        <p className="text-sm">Small (14px) - Secondary content and captions</p>
        <p className="text-xs">Extra Small (12px) - Labels and metadata</p>
      </div>
    </div>
  </div>
)

export const Spacing: Story = () => (
  <div className="space-y-8">
    <h2 className="font-heading text-xl mb-4">Spacing Scale</h2>
    <div className="space-y-3">
      {[
        { name: '1', value: '4px' },
        { name: '2', value: '8px' },
        { name: '3', value: '12px' },
        { name: '4', value: '16px' },
        { name: '6', value: '24px' },
        { name: '8', value: '32px' },
        { name: '12', value: '48px' },
        { name: '16', value: '64px' },
      ].map(({ name, value }) => (
        <div key={name} className="flex items-center gap-4">
          <div className="bg-accent h-4" style={{ width: value }} />
          <code className="text-sm text-muted-foreground w-16">space-{name}</code>
          <span className="text-xs text-muted-foreground">{value}</span>
        </div>
      ))}
    </div>
  </div>
)

export const BorderRadius: Story = () => (
  <div className="space-y-8">
    <h2 className="font-heading text-xl mb-4">Border Radius</h2>
    <div className="flex gap-6">
      {[
        { name: 'sm', value: '4px' },
        { name: 'DEFAULT', value: '6px' },
        { name: 'md', value: '8px' },
        { name: 'lg', value: '12px' },
        { name: 'xl', value: '16px' },
      ].map(({ name, value }) => (
        <div key={name} className="text-center">
          <div className="w-16 h-16 bg-accent mb-2" style={{ borderRadius: value }} />
          <code className="text-xs text-muted-foreground">{name}</code>
          <div className="text-xs text-muted-foreground">{value}</div>
        </div>
      ))}
    </div>
  </div>
)

export const Shadows: Story = () => (
  <div className="space-y-8">
    <h2 className="font-heading text-xl mb-4">Shadow Tokens</h2>
    <div className="flex gap-8">
      <div className="text-center">
        <div className="w-24 h-24 bg-card rounded-lg shadow-md mb-3" />
        <code className="text-xs text-muted-foreground">shadow-md</code>
      </div>
      <div className="text-center">
        <div className="w-24 h-24 bg-card rounded-lg shadow-lg mb-3" />
        <code className="text-xs text-muted-foreground">shadow-lg</code>
      </div>
      <div className="text-center">
        <div className="w-24 h-24 bg-accent rounded-lg shadow-glow mb-3" />
        <code className="text-xs text-muted-foreground">shadow-glow</code>
        <div className="text-xs text-muted-foreground mt-1">Accent glow effect</div>
      </div>
    </div>
  </div>
)
