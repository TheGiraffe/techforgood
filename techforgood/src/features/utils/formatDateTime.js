export function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    if (isToday) {
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffHours > 0) {
            return `Posted ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
            return 'Posted just now';
        }
    }

    // unless the request was made same day, only showing date request was made
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return `Posted: ${formattedDate}`;
}

// if we want hours and minutes, though seems unecessary
    // let hours = date.getHours();
    // const minutes = String(date.getMinutes()).padStart(2, '0');
    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'