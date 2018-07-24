const exportFile = (fileName, content) => {
    var aTag = document.createElement('a')
    var blob = new Blob([content])

    aTag.download = fileName
    aTag.href = URL.createObjectURL(blob)
    aTag.click()
    URL.revokeObjectURL(blob)
}
export default exportFile