export function initSkillsCloud() {
    const container = document.getElementById('skills-container');
    const texts = [
        'JavaScript', 'HTML5', 'CSS3', 'React', 'Node.js',
        'Python', 'Git', 'TypeScript', 'Vite', 'Three.js',
        'SQL', 'NoSQL', 'Docker', 'AWS', 'Figma'
    ];

    const options = {
        radius: 200,
        maxSpeed: 'normal',
        initSpeed: 'normal',
        direction: 135,
        keep: true
    };

    // Simple TagCloud implementation
    class TagCloud {
        constructor(container, texts, options) {
            this.container = container;
            this.texts = texts;
            this.options = options || {};
            this.radius = this.options.radius || 150;
            this.dtr = Math.PI / 180;
            this.d = 300;

            this.mcList = [];
            this.active = false;
            this.lasta = 1;
            this.lastb = 1;
            this.distr = true;
            this.tspeed = 5; // standard speed
            this.size = 250;

            this.mouseX = 0;
            this.mouseY = 0;

            this.howElliptical = 1;

            this.aA = null;
            this.oDiv = null;

            this.init();
        }

        init() {
            this.oDiv = document.createElement('div');
            this.oDiv.className = 'tag-cloud-container';
            this.container.appendChild(this.oDiv);

            for (let i = 0; i < this.texts.length; i++) {
                const oTag = document.createElement('a');
                oTag.innerHTML = this.texts[i];
                oTag.className = 'tag-cloud-item';
                oTag.href = 'javascript:void(0);';
                this.oDiv.appendChild(oTag);
                this.mcList.push({
                    offsetWidth: oTag.offsetWidth,
                    offsetHeight: oTag.offsetHeight,
                    el: oTag
                });
            }

            this.sineCosine(0, 0, 0);
            this.positionAll();

            this.container.addEventListener('mouseover', () => { this.active = true; });
            this.container.addEventListener('mouseout', () => { this.active = false; });
            this.container.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                this.mouseX = (e.clientX - (rect.left + rect.width / 2)) / 5;
                this.mouseY = (e.clientY - (rect.top + rect.height / 2)) / 5;
            });

            // Touch support
            this.container.addEventListener('touchstart', () => { this.active = true; });
            this.container.addEventListener('touchend', () => { this.active = false; });
            this.container.addEventListener('touchmove', (e) => {
                const rect = this.container.getBoundingClientRect();
                this.mouseX = (e.touches[0].clientX - (rect.left + rect.width / 2)) / 5;
                this.mouseY = (e.touches[0].clientY - (rect.top + rect.height / 2)) / 5;
            });

            setInterval(() => this.update(), 30);
        }

        update() {
            let a, b;

            if (this.active) {
                a = (-Math.min(Math.max(-this.mouseY, -this.size), this.size) / this.radius) * this.tspeed;
                b = (Math.min(Math.max(-this.mouseX, -this.size), this.size) / this.radius) * this.tspeed;
            } else {
                a = this.lasta * 0.98;
                b = this.lastb * 0.98;
            }

            this.lasta = a;
            this.lastb = b;

            if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
                return;
            }

            const c = 0;
            this.sineCosine(a, b, c);

            for (let j = 0; j < this.mcList.length; j++) {
                const rx1 = this.mcList[j].cx;
                const ry1 = this.mcList[j].cy * this.ca + this.mcList[j].cz * (-this.sa);
                const rz1 = this.mcList[j].cy * this.sa + this.mcList[j].cz * this.ca;

                const rx2 = rx1 * this.cb + rz1 * this.sb;
                const ry2 = ry1;
                const rz2 = rx1 * (-this.sb) + rz1 * this.cb;

                const rx3 = rx2 * this.cc + ry2 * (-this.sc);
                const ry3 = rx2 * this.sc + ry2 * this.cc;
                const rz3 = rz2;

                this.mcList[j].cx = rx3;
                this.mcList[j].cy = ry3;
                this.mcList[j].cz = rz3;

                const per = this.d / (this.d + rz3);

                this.mcList[j].x = (this.howElliptical * rx3 * per) - (this.howElliptical * 2);
                this.mcList[j].y = ry3 * per;
                this.mcList[j].scale = per;
                this.mcList[j].alpha = per;

                this.mcList[j].alpha = (this.mcList[j].alpha - 0.6) * (10 / 6);
            }

            this.doPosition();
            this.depthSort();
        }

        depthSort() {
            this.mcList.sort((a, b) => b.cz - a.cz);
            for (let i = 0; i < this.mcList.length; i++) {
                this.mcList[i].el.style.zIndex = i;
            }
        }

        doPosition() {
            const l = this.oDiv.offsetWidth / 2;
            const t = this.oDiv.offsetHeight / 2;
            for (let i = 0; i < this.mcList.length; i++) {
                this.mcList[i].el.style.left = this.mcList[i].cx + l - this.mcList[i].offsetWidth / 2 + 'px';
                this.mcList[i].el.style.top = this.mcList[i].cy + t - this.mcList[i].offsetHeight / 2 + 'px';
                this.mcList[i].el.style.fontSize = Math.ceil(12 * this.mcList[i].scale / 2) + 8 + 'px';
                this.mcList[i].el.style.filter = "alpha(opacity=" + 100 * this.mcList[i].alpha + ")";
                this.mcList[i].el.style.opacity = this.mcList[i].alpha;
            }
        }

        positionAll() {
            let phi = 0;
            let theta = 0;
            const max = this.mcList.length;

            for (let i = 0; i < max; i++) {
                if (this.distr) {
                    phi = Math.acos(-1 + (2 * i + 1) / max);
                    theta = Math.sqrt(max * Math.PI) * phi;
                } else {
                    phi = Math.random() * (Math.PI);
                    theta = Math.random() * (2 * Math.PI);
                }

                this.mcList[i].cx = this.radius * Math.cos(theta) * Math.sin(phi);
                this.mcList[i].cy = this.radius * Math.sin(theta) * Math.sin(phi);
                this.mcList[i].cz = this.radius * Math.cos(phi);

                this.mcList[i].el.style.left = this.mcList[i].cx + this.oDiv.offsetWidth / 2 - this.mcList[i].offsetWidth / 2 + 'px';
                this.mcList[i].el.style.top = this.mcList[i].cy + this.oDiv.offsetHeight / 2 - this.mcList[i].offsetHeight / 2 + 'px';
            }
        }

        sineCosine(a, b, c) {
            this.sa = Math.sin(a * this.dtr);
            this.ca = Math.cos(a * this.dtr);
            this.sb = Math.sin(b * this.dtr);
            this.cb = Math.cos(b * this.dtr);
            this.sc = Math.sin(c * this.dtr);
            this.cc = Math.cos(c * this.dtr);
        }
    }

    new TagCloud(container, texts, options);
}
