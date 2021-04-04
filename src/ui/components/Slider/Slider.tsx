import { SliderStyles as styles } from ".";

export type SliderProps = {};
export default function Slider(props: SliderProps) {
  const marks = [1, 2, 3, 4, 5].map((n, i, arr) => (
    <span
      className={styles.Mark}
      style={{ left: `${(100 / (arr.length - 1)) * i}%` }}
    ></span>
  ));
  return (
    <div className={styles.Slider} {...props}>
      <div className={styles.Rail}></div>
      <div className={styles.Track}></div>
      <div className={styles.Steps}>{marks}</div>
      <div className={styles.Handle}></div>
      <div className={styles.Mark}></div>
    </div>
  );
}
