import "./SliderIndicator.scss";

type Props = {
  totalCards: number;
  startIndex: number;
  cardsInView: number;
};

export const SliderIndicator: React.FC<Props> = ({
  totalCards,
  startIndex,
  cardsInView,
}) => {
  const progress = ((startIndex + cardsInView) / totalCards) * 100;

  return (
    <div className="indicator">
      <div className="indicator__progressBar">
        <div
          className="indicator__progress"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
