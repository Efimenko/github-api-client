export const calcDate = (date) => {
  const update = new Date(date)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const delta = {}

  delta.days = Math.round((new Date() - update) / 1000 / 60 / 60 / 24)
  delta.hours = delta.days * 24
  delta.minutes = delta.hours * 60
  delta.seconds = delta.seconds * 60

  if (delta.days > 31) {
    return `on ${update.getDate()} ${months[update.getMonth()]}
    ${update.getFullYear() < new Date().getFullYear() ? update.getFullYear() : ''}`
  } else if (delta.days <= 31 && delta.days >= 1) {
    return delta.days === 1 ? `${delta.days} day ago` : `${delta.days} days ago`
  } else if (delta.hours <= 24 && delta.hours >= 1) {
    return delta.hours === 1 ? `${delta.hours} hour ago` : `${delta.hours} hours ago`
  } else if (delta.minutes <= 60 && delta.minutes >= 1) {
    return delta.minutes === 1 ? `${delta.minutes} minute ago` : `${delta.minutes} minutes ago`
  } else if (delta.seconds <= 60 && delta.seconds >= 1) {
    return delta.seconds === 1 ? `${delta.seconds} second ago` : `${delta.seconds} seconds ago`
  }
}
