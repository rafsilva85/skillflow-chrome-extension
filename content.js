// SkillFlow Chrome Extension — Content Script
// Detects SKILL.md files in GitHub repos and shows SkillFlow trust score badge

(async function() {
  // Only run on GitHub repo pages
  const path = window.location.pathname;
  if (!path.match(/^\/[^\/]+\/[^\/]+\/?$/)) return;

  // Check if repo has SKILL.md
  const [, owner, repo] = path.match(/^\/([^\/]+)\/([^\/]+)/) || [];
  if (!owner || !repo) return;

  try {
    const resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/SKILL.md`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (resp.ok) {
      // Repo has SKILL.md — inject SkillFlow badge
      const aboutSection = document.querySelector('[class*="BorderGrid-cell"]');
      if (!aboutSection) return;

      const badge = document.createElement('div');
      badge.className = 'skillflow-badge';
      badge.innerHTML = `
        <a href="https://skillflow.builders/explore?q=${encodeURIComponent(repo)}" 
           target="_blank" class="skillflow-badge-link">
          <span class="sf-icon">SF</span>
          <span class="sf-text">Listed on SkillFlow</span>
          <span class="sf-score">★ Verified</span>
        </a>
      `;
      aboutSection.parentElement.insertBefore(badge, aboutSection.nextSibling);
    }
  } catch (e) {
    // Silently fail — don't break GitHub
  }
})();
