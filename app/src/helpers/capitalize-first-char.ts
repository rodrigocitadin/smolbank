export default function capitalizeFirstChar(value: string) {
  return value.length >= 2
    ? value[0].toUpperCase() + value.slice(1)
    : value.toUpperCase()
}
