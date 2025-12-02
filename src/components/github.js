// ดึงข้อมูล GitHub Profile
export async function fetchGitHubProfile(username = 'ELIXREIX') {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('GitHub User Not Found');
        return await response.json();
    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        return null;
    }
}

// ดึง GitHub Repositories พร้อม GitHub Pages info
export async function fetchGitHubRepos(username = 'ELIXREIX') {
    const grid = document.getElementById('repos-grid');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=6`);
        if (!response.ok) throw new Error('GitHub User Not Found');

        const repos = await response.json();

        // Sort by stars (descending)
        repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

        grid.innerHTML = ''; // Clear loading state

        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'glass-card repo-card';

            // สร้าง GitHub Pages URL ถ้ามี
            const hasPages = repo.has_pages;
            const pagesUrl = hasPages ? `https://${username.toLowerCase()}.github.io/${repo.name}/` : null;

            // สร้างปุ่ม View Live ถ้ามี GitHub Pages
            const liveButton = hasPages ? `
                <a href="${pagesUrl}" target="_blank" class="repo-link live-link">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    View Live
                </a>
            ` : '';

            card.innerHTML = `
        <div class="repo-header">
          <h3 class="repo-name">${repo.name}</h3>
          <div class="repo-stars">
            <span>★</span> ${repo.stargazers_count}
          </div>
        </div>
        <p class="repo-desc">${repo.description || 'No description available.'}</p>
        <div class="repo-footer">
          <span class="repo-lang">${repo.language || 'Code'}</span>
          <div class="repo-links">
            ${liveButton}
            <a href="${repo.html_url}" target="_blank" class="repo-link">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              View Code
            </a>
          </div>
        </div>
      `;

            grid.appendChild(card);
        });
    } catch (error) {
        grid.innerHTML = `<div class="glass-card error-card">Failed to load projects. <br> ${error.message}</div>`;
    }
}
