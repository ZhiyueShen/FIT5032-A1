<template>
  <main class="container py-5" id="about" role="main">
    <img :src="aboutImg" alt="About Men's Health" class="hero-img" />
    <h1 class="mb-3">About Men’s Health Hub</h1>

    <article id="aboutContent" class="bg-light p-4 rounded shadow-sm" aria-label="About our mission and purpose">
      <p>
        <strong>Men’s Health Hub</strong> is a digital platform built to empower men to take charge of their wellbeing —
        physically, mentally, and emotionally. Our goal is to provide accessible, evidence-based, and inclusive health
        information that supports positive lifestyle changes.
      </p>
      <p>
        We believe that every man deserves the tools and knowledge to lead a healthy life.
        From exercise and nutrition tips to mental health guidance and medical resources,
        our content is designed to inspire and inform.
      </p>
      <p>
        The platform combines reliable data, expert insights, and community-driven advice to help men
        build sustainable habits and improve overall quality of life.
      </p>
      <ul>
        <li>Physical and Mental Health Resources</li>
        <li>Nutrition and Lifestyle Guidance</li>
        <li>Nearby Hospital and Clinic Finder</li>
        <li>Exportable Reports and Progress Tools</li>
      </ul>
    </article>

    <!-- Export Button -->
    <div class="mt-4">
      <button class="btn btn-outline-primary" @click="exportAboutPDF">
        Export as PDF
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import aboutImg from "../assets/aboutus.avif";

async function exportAboutPDF() {
  const element = document.getElementById("aboutContent");
  if (!element) return; //get the element called "aboutContent"

  const canvas = await html2canvas(element, { //cut the element to canvas
    scale: 2, 
    useCORS: true,
    scrollY: 0,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight, //Force capture of the entire content area
  });

  const imgD = canvas.toDataURL("image/png"); // Turn canvas to image
  const pdf = new jsPDF("p", "mm", "a4"); // Create a pdf.

  //count the page proportion
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 20; 
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10; 

  pdf.addImage(imgD, "PNG", 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - 20; 

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 10;
    pdf.addPage();
    pdf.addImage(imgD, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;
  }

  pdf.save("About_Mens_Health_Hub.pdf");
}

</script>
<style scoped>
.hero-img {
  width: 100%;
  max-height: 380px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

h1 {
  color: #000; 
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
}

#aboutContent {
  background-color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  max-width: 850px;
  margin: 0 auto;
  line-height: 1.7;
  color: #333;
}

#aboutContent p {
  margin-bottom: 1rem;
  font-size: 1rem;
}

/* list */
#aboutContent ul {
  list-style: disc;
  margin-left: 1.5rem;
  color: #444;
}

#aboutContent li {
  margin-bottom: 0.5rem;
}

/* import button */
.btn-outline-primary {
  display: block;
  margin: 2rem auto 0;
  border-color: #f4b400 !important;
  color: #f4b400 !important;
  font-weight: 600;
  padding: 0.6rem 1.4rem;
  border-radius: 50px;
  transition: all 0.25s ease;
}

.btn-outline-primary:hover {
  background-color: #f4b400 !important;
  color: #fff !important;
  border-color: #f4b400 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(244, 180, 0, 0.3);
}

@media (max-width: 768px) {
  main#about {
    padding: 2rem 1rem;
  }
  #aboutContent {
    padding: 1.5rem;
  }
  h1 {
    font-size: 1.6rem;
  }
  .hero-img {
    max-height: 260px;
  }
}
</style>

