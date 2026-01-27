import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const isThisWeek = (date) => {
  const d = new Date(date);
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (now.getDay() || 7) + 1);
  monday.setHours(0, 0, 0, 0);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(23, 59, 59, 999);

  return d >= monday && d <= friday;
};

export default function ExportButtons({ tasks }) {
  const exportPDF = () => {
    if (!tasks || tasks.length === 0) return;

    const doc = new jsPDF();
    let cursorY = 15;

    doc.setFontSize(16);
    doc.text("Daily Task Report", 14, cursorY);
    cursorY += 8;

    // ================= GROUP BY DEVELOPER =================
    const devMap = {};
    tasks.forEach((t) => {
      const devName = `${t.developer.firstName} ${t.developer.lastName}`;
      if (!devMap[devName]) devMap[devName] = [];
      devMap[devName].push(t);
    });

    Object.entries(devMap).forEach(([developer, devTasks], devIndex) => {
      if (devIndex > 0) {
        doc.addPage();
        cursorY = 15;
      }

      // ===== Developer Title =====
      doc.setFontSize(13);
      doc.setTextColor(40);
      doc.text(`Developer: ${developer}`, 14, cursorY);
      cursorY += 6;

      // ===== Split tasks: This Week first =====
      const thisWeekTasks = devTasks.filter((t) => isThisWeek(t.date));
      const olderTasks = devTasks.filter((t) => !isThisWeek(t.date));

      const buildRows = (list) =>
        list.map((t, i) => [
          i + 1,
          new Date(t.date).toLocaleDateString(),
          t.project,
          t.task,
          t.status,
          t.startTime || "-",
          t.endTime || "-",
          t.workingHours || "-",
          t.pmCheck,
          t.teamLeadCheck,
        ]);

      // ===== THIS WEEK =====
      if (thisWeekTasks.length > 0) {
        doc.setFontSize(11);
        doc.text("This Week", 14, cursorY);
        cursorY += 3;

        autoTable(doc, {
          startY: cursorY,
          head: [
            [
              "#",
              "Date",
              "Project",
              "Task",
              "Status",
              "Start",
              "End",
              "Hours",
              "PM",
              "TL",
            ],
          ],
          body: buildRows(thisWeekTasks),
          styles: { fontSize: 8 },
          headStyles: {
            fillColor: [37, 99, 235],
            textColor: 255,
          },
        });

        cursorY = doc.lastAutoTable.finalY + 6;
      }

      // ===== OLDER TASKS =====
      if (olderTasks.length > 0) {
        doc.setFontSize(11);
        doc.text("Previous Tasks", 14, cursorY);
        cursorY += 3;

        autoTable(doc, {
          startY: cursorY,
          head: [
            [
              "#",
              "Date",
              "Project",
              "Task",
              "Status",
              "Start",
              "End",
              "Hours",
              "PM",
              "TL",
            ],
          ],
          body: buildRows(olderTasks),
          styles: { fontSize: 8 },
          headStyles: {
            fillColor: [100, 116, 139], // slate
            textColor: 255,
          },
        });

        cursorY = doc.lastAutoTable.finalY + 8;
      }
    });

    doc.save("daily-task-report.pdf");
  };

  return (
    <button
      onClick={exportPDF}
      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
    >
      Download PDF
    </button>
  );
}
