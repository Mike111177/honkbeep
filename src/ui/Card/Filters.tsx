export const OutlineFilter = (
  <defs>
    <filter id="outline">
      <feComponentTransfer>
        <feFuncR type="linear" slope="0" />
        <feFuncG type="linear" slope="0" />
        <feFuncB type="linear" slope="0" />
      </feComponentTransfer>
      <feMorphology operator="dilate" radius="1" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);
