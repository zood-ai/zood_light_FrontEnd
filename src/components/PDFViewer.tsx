const PDFViewer = ({ fileUrl }) => {
  return (
    <iframe
      src={fileUrl}
      width='100%'
      height='100%'
      // type='application/pdf'
    >
      This browser does not support PDFs. Please download the PDF to view it:{' '}
      <a href={fileUrl}>Download PDF</a>.
    </iframe>
  )
}

export default PDFViewer
