export const calcDate = (date) => {
  const update = new Date(date)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const delta = {}

  delta.days = (new Date() - update) / 1000 / 60 / 60 / 24
  delta.hours = Math.floor(delta.days * 24)
  delta.minutes = Math.floor(delta.days * 24 * 60)
  delta.seconds = Math.floor(delta.days * 24 * 60 * 60)

  if (delta.seconds <= 60 && delta.seconds >= 1) {
    return delta.seconds === 1 ? `${delta.seconds} second ago` : `${delta.seconds} seconds ago`
  } else if (delta.minutes <= 60 && delta.minutes >= 1) {
    return delta.minutes === 1 ? `${delta.minutes} minute ago` : `${delta.minutes} minutes ago`
  } else if (delta.hours <= 24 && delta.hours >= 1) {
    return delta.hours === 1 ? `${delta.hours} hour ago` : `${delta.hours} hours ago`
  } else if (delta.days <= 31 && delta.days >= 1) {
    return Math.round(delta.days) === 1 ? `${Math.round(delta.days)} day ago` : `${Math.round(delta.days)} days ago`
  } else if (delta.days > 31) {
    return `on ${update.getDate()} ${months[update.getMonth()]}
    ${update.getFullYear() < new Date().getFullYear() ? update.getFullYear() : ''}`
  }
}
