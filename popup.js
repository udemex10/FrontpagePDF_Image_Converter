window.jsPDF = window.jspdf.jsPDF
// Add event listener for the 'change' event on the file input
document.getElementById('convert-button').addEventListener('click', () => {
  //Get the file input element
  let input = document.getElementById('file-input');
  let file = input.files[0];
  let pdfjsLib = window['pdfjs-dist/build/pdf'];


  if(file.type.startsWith("image/")) {
    //convertButton.innerHTML = "Convert to PDF";
      let reader = new FileReader();
      reader.onload = (e) => {
          //Convert the image to pdf and save it
          let pdf = new jsPDF();
          pdf.addImage(e.target.result, 'JPEG', 0, 0);
          pdf.save("image.pdf");
          //Show success message
          document.getElementById("status").innerHTML = "File Downloaded";
          chrome.downloads.download({
            url: pdf.output('datauristring'),
            filename: 'image.pdf',
            conflictAction: 'uniquify'
          });
          

      }
      reader.readAsDataURL(file);
  }
  else if(file.type === "application/pdf") {
    //convertButton.innerHTML = "Convert to Image";
      let reader = new FileReader();
      reader.onload = (e) => {
          //Convert the pdf to image and save it
          pdfjsLib.getDocument(e.target.result).promise.then(pdf => {
              pdf.getPage(1).then(page => {
                  let canvas = document.createElement("canvas");
                  let ctx = canvas.getContext("2d");
                  let viewport = page.getViewport({scale:1});
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;
                  page.render({canvasContext: ctx, viewport: viewport}).promise.then(() => {
                      let img = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                      document.location.href = img;
                      //Show success message
                      document.getElementById("status").innerHTML = "File Downloaded";
                      // Add download functionality
                      chrome.downloads.download({
                          url: img,
                          filename: 'image.jpg',
                          conflictAction: 'uniquify'
                      });
                  });
              });
          });
      }
      reader.readAsArrayBuffer(file);
  }
  else{
      //Show error message
      document.getElementById("status").innerHTML = "Invalid file type";
  }
  
});
