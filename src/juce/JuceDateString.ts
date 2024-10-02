export class JuceDateString {
    static inHexMs(date: Date): string {
        // Ports juce::String::toHexString (juce::Time::getCurrentTime().toMilliseconds())
        return date.getTime().toString(16)
    }

    static inFormattedComment(date: Date): string {
        // Ports juce::Time::getCurrentTime().toString (true, true)
        // prettier-ignore
        const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
        const day = date.getDate().toString().padStart(2, '0')
        const month = months[date.getMonth()]
        const year = date.getFullYear()
        let hours = date.getHours()
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')
        const ampm = hours >= 12 ? 'pm' : 'am'
        hours = hours % 12
        hours = hours ? hours : 12
        return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}${ampm}`
    }
}
