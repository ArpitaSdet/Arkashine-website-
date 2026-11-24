// Renders copy and highlights [placeholder] segments so unconfirmed claims stay visible.
export function Txt({ children }: { children: string }) {
  const parts = children.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[") ? (
          <span key={i} className="placeholder-tag" title="Placeholder: awaiting confirmation from ArkaShine">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
