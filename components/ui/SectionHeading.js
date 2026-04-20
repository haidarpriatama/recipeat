const alignClasses = {
  left: "text-left",
  center: "text-center",
};

export default function SectionHeading({
  title,
  description,
  align = "left",
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}) {
  const resolvedAlign = alignClasses[align] ?? alignClasses.left;

  return (
    <div className={`${resolvedAlign} ${className}`.trim()}>
      <h2 className={`text-4xl font-black tracking-tight md:text-5xl ${titleClassName}`.trim()}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-lg text-[#595c5d] ${descriptionClassName}`.trim()}>
          {description}
        </p>
      ) : null}
    </div>
  );
}