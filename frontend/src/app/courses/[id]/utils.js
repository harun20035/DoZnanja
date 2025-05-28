/**
 * Format date to local format
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return "N/A"

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "N/A"
    }

    return date.toLocaleDateString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "N/A"
  }
}

/**
 * Format price with discount
 * @param {number} price - Original price
 * @param {number} discountPercent - Discount percentage
 * @returns {object} Object with original and discounted price
 */
export function formatPrice(price, discountPercent = 0) {
  if (typeof price !== "number") {
    return { original: "N/A", discounted: "N/A", hasDiscount: false }
  }

  const original = price.toFixed(2)

  if (!discountPercent) {
    return { original, discounted: original, hasDiscount: false }
  }

  const discounted = (price * (1 - discountPercent / 100)).toFixed(2)

  return {
    original,
    discounted,
    hasDiscount: true,
    discountPercent,
  }
}

/**
 * Get status badge class based on status
 * @param {string} status - Status string
 * @returns {string} CSS class for badge
 */
export function getStatusBadgeClass(status) {
  if (!status) return "bg-secondary"

  switch (status.toUpperCase()) {
    case "APPROVED":
      return "bg-success"
    case "PENDING":
      return "bg-warning text-dark"
    case "REJECTED":
      return "bg-danger"
    default:
      return "bg-secondary"
  }
}
