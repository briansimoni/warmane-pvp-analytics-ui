import "../../App.css";

type SearchLabelProps = {
  hoveredRealm: string | null;
  htmlFor: string;
  onMouseEnter: (event: React.MouseEvent<HTMLLabelElement>) => void;
  onMouseLeave: () => void;
  selectedRealm: string;
};

const SearchLabel: React.FC<SearchLabelProps> = ({
  hoveredRealm,
  htmlFor,
  onMouseEnter,
  onMouseLeave,
  selectedRealm,
}: SearchLabelProps) => {
  const isSelectedRealm = selectedRealm === htmlFor;
  const isHoveredRealm = hoveredRealm === htmlFor;
  const antiSelectedClass =
    selectedRealm && !isSelectedRealm ? " anti-selected-realm" : "";
  const antiHoveredClass =
    selectedRealm && !isHoveredRealm ? " anti-hovered-realm" : "";

  return (
    <label
      htmlFor={htmlFor}
      className={`radio-label ${htmlFor.toLowerCase()}${antiSelectedClass}${antiHoveredClass}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {htmlFor}
    </label>
  );
};

export default SearchLabel;
