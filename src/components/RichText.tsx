interface RichTextProps {
  text: string;
}

export default function RichText({ text }: RichTextProps) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index} className="font-semibold text-cyan-300">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
}
