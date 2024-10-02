interface Achievement {
  id: string;
  name: string;
  description: string;
  value: number | string;
  icon?: string;
}

interface AchievementSystem {
  achievements: Achievement[];
  quickestTicket: { time: number; ticketId: string } | null;
  longestTicket: { time: number; ticketId: string } | null;
  mostItemsTicket: { items: number; ticketId: string } | null;
  totalTicketsProcessed: number;
}

let system: AchievementSystem = loadAchievements() || {
  achievements: [],
  quickestTicket: null,
  longestTicket: null,
  mostItemsTicket: null,
  totalTicketsProcessed: 0,
};

function loadAchievements(): AchievementSystem | null {
  const saved = localStorage.getItem('achievementSystem');
  return saved ? JSON.parse(saved) : null;
}

function saveAchievements() {
  localStorage.setItem('achievementSystem', JSON.stringify(system));
}

function updateTicketProcessed(ticketId: string, processingTime: number, itemCount: number) {
  system.totalTicketsProcessed++;

  if (!system.quickestTicket || processingTime < system.quickestTicket.time) {
    system.quickestTicket = { time: processingTime, ticketId };
    addAchievement('quickest-ticket', 'Speedster', 'Fastest ticket processed', formatTime(processingTime));
  }

  if (!system.longestTicket || processingTime > system.longestTicket.time) {
    system.longestTicket = { time: processingTime, ticketId };
    addAchievement('longest-ticket', 'Endurance', 'Longest ticket processed', formatTime(processingTime));
  }

  if (!system.mostItemsTicket || itemCount > system.mostItemsTicket.items) {
    system.mostItemsTicket = { items: itemCount, ticketId };
    addAchievement('most-items', 'Bulk Order', 'Most items in a ticket', itemCount.toString());
  }

  addAchievement('total-processed', 'Ticket Master', 'Total tickets processed', system.totalTicketsProcessed.toString());

  saveAchievements();
  displayAchievements();
}

function addAchievement(id: string, name: string, description: string, value: string) {
  const existingIndex = system.achievements.findIndex(a => a.id === id);
  const achievement: Achievement = { id, name, description, value };

  if (existingIndex !== -1) {
    system.achievements[existingIndex] = achievement;
  } else {
    system.achievements.push(achievement);
  }
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function displayAchievements() {
  let achievementsElement = document.getElementById('achievements-display');
  if (!achievementsElement) {
    achievementsElement = document.createElement('div');
    achievementsElement.id = 'achievements-display';
    achievementsElement.style.cssText = `
      position: fixed;
      display:none;
      top: 20px;
      right: 20px;
      background-color: rgba(255, 255, 255, 0.9);
      border: 2px solid #4CAF50;
      border-radius: 10px;
      padding: 15px;
      max-width: 300px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    `;
    document.body.appendChild(achievementsElement);
  }

  achievementsElement.innerHTML = `
    <h3 style="margin-top: 0; color: #4CAF50;">Achievements</h3>
    ${system.achievements.map(a => `
      <div class="achievement" style="margin-bottom: 10px;">
        <h4 style="margin: 0; color: #2196F3;">${a.name}</h4>
        <p style="margin: 0;">${a.description}: <strong>${a.value}</strong></p>
      </div>
    `).join('')}
  `;
}

export const achievementSystem = {
  updateTicketProcessed,
  displayAchievements,
};
