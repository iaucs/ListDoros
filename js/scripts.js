document.addEventListener("DOMContentLoaded", () => {
  const jsonDataUrl = "./data/4041.json";
  let jsonData = [];
  const pageSize = 20;
  let currentPage = 1;
  let filteredData = [];

  const fetchData = async () => {
    try {
      const response = await fetch(jsonDataUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      jsonData = await response.json();
      filteredData = jsonData;
      initializeTable(jsonData);
    } catch (error) {
      console.error(error);
      alert("Error loading data.");
    }
  };

  const generateHeaders = (data) => {
    const headersRow = document.getElementById("tableHeaders");
    headersRow.innerHTML = "";
    const headers = Object.keys(data[0]);
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.classList.add(
        "border",
        "border-gray-700",
        "px-4",
        "py-3",
        "text-gray-300"
      );
      th.textContent = header;
      headersRow.appendChild(th);
    });
  };

  const populateTable = (data) => {
    const tableBody = document.getElementById("courseTable");
    tableBody.innerHTML = "";
    data.forEach((course, index) => {
      const row = document.createElement("tr");
      Object.entries(course).forEach(([key, value]) => {
        const td = document.createElement("td");
        td.classList.add("border", "border-gray-700", "px-4", "py-3");
        if (key === "كد ارائه کلاس درس") {
          td.innerHTML = `
              <span id="courseCode-${index}">${value}</span>
              <button onclick="copyCourseCode('courseCode-${index}')" class="ml-2 text-blue-500 hover:text-blue-700">
                <i class="fas fa-copy"></i>
              </button>
            `;
        } else {
          td.textContent = value || "-";
        }
        row.appendChild(td);
      });
      tableBody.appendChild(row);
    });
  };

  const searchInputCode = document.getElementById("searchInputCode");

  const updateTable = () => {
    const searchTermCode = searchInputCode.value.trim().toLowerCase();
    if (searchTermCode === "") {
      filteredData = jsonData;
    } else {
      filteredData = jsonData.filter((course) => {
        return Object.values(course).some(
          (value) =>
            value && value.toString().toLowerCase().includes(searchTermCode)
        );
      });
    }
    currentPage = 1;
    const paginatedData = paginateData(filteredData);
    populateTable(paginatedData);
    updatePaginationControls(filteredData);
    updateResultSummary(filteredData);
  };

  const paginateData = (data) => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  };

  const updatePaginationControls = (data) => {
    const totalPages = Math.ceil(data.length / pageSize);
    const pageInfo = document.getElementById("pageInfo");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");

    pageInfo.textContent = `صفحه ${currentPage} از ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  };

  const updateResultSummary = (data) => {
    const resultSummary = document.getElementById("resultSummary");
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, data.length);
    resultSummary.textContent = `در حال نمایش ${start} تا ${end} از ${data.length} ورودی «فیلتر شده از تمام ${jsonData.length} ورودی»`;
  };

  const initializeTable = (jsonData) => {
    generateHeaders(jsonData);
    const paginatedData = paginateData(jsonData);
    populateTable(paginatedData);
    updatePaginationControls(jsonData);
    updateResultSummary(jsonData);
  };

  document.getElementById("prevButton").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      const paginatedData = paginateData(filteredData);
      populateTable(paginatedData);
      updatePaginationControls(filteredData);
      updateResultSummary(filteredData);
    }
  });

  document.getElementById("nextButton").addEventListener("click", () => {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      const paginatedData = paginateData(filteredData);
      populateTable(paginatedData);
      updatePaginationControls(filteredData);
      updateResultSummary(filteredData);
    }
  });

  searchInputCode.addEventListener("input", updateTable);

  fetchData();
});

function copyCourseCode(elementId) {
  const courseCodeElement = document.getElementById(elementId);
  const courseCode = courseCodeElement.textContent;
  navigator.clipboard
    .writeText(courseCode)
    .then(() => {
      alert("کد ارائه درس کپی شد: " + courseCode);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}
