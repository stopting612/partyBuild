import styles from 'components/common/FilterButton/FilterButton.module.css'

interface IFilter {
  name: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  active?: string
}

export function FilterButton({ name, onClick, active }: IFilter) {
  return (
    <button
      className={
        active ? `${styles.button} ${styles.active}` : `${styles.button}`
      }
      onClick={onClick}>
      {name}
    </button>
  )
}
