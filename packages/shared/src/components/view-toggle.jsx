export default function ViewToggle({
  isAlt,
  onToggle,
  label,
  altLabel,
  Icon,
  AltIcon,
  iconSize = 'text-xl',
  altIconSize,
}) {
  const resolvedAltIconSize = altIconSize || iconSize

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-light tracking-wide">
        {isAlt ? altLabel : label}
      </span>
      <button
        className="relative h-8 w-8 duration-200 ease-out hover:scale-[1.1]"
        onClick={onToggle}
      >
        <Icon
          className={`absolute inset-0 m-auto ${iconSize}`}
          style={{
            opacity: isAlt ? 0 : 1,
            transform: isAlt ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'opacity 300ms ease, transform 300ms ease',
          }}
        />
        <AltIcon
          className={`absolute inset-0 m-auto ${resolvedAltIconSize}`}
          style={{
            opacity: isAlt ? 1 : 0,
            transform: isAlt ? 'rotate(0deg)' : 'rotate(-180deg)',
            transition: 'opacity 300ms ease, transform 300ms ease',
          }}
        />
      </button>
    </div>
  )
}
