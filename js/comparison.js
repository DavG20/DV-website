// Charts for the comparison section of index.html. All colors and styles live in css/style.css;
// marks only get class names here.

const EXPOSURE = [
  "Not exposed",
  "Minimal",
  "Gradient 1 (low)",
  "Gradient 2 (moderate)",
  "Gradient 3 (significant)",
  "Gradient 4 (highest)",
];
const SIZES = ["Small (10-49)", "Medium (50-249)", "Large (250+)"];
const HEAT_BINS = [5, 10, 15, 20, 25, 30]; // thresholds in % -> 7 bins

const tooltip = d3.select("#tooltip");
const DATA_ROOT = document.body.dataset.dataRoot || "data";
const pct = (v) => `${d3.format(".1f")(v)}%`;
const has = (selector) => Boolean(document.querySelector(selector));

function showTooltip(event, html) {
  if (tooltip.empty()) return;
  tooltip.html(html).classed("visible", true);
  moveTooltip(event);
}

function moveTooltip(event) {
  if (tooltip.empty()) return;
  const node = tooltip.node();
  const x = Math.min(event.clientX + 14, window.innerWidth - node.offsetWidth - 8);
  const y = event.clientY - node.offsetHeight - 10;
  tooltip.style("left", `${x}px`).style("top", `${y < 8 ? event.clientY + 16 : y}px`);
}

function hideTooltip() {
  if (tooltip.empty()) return;
  tooltip.classed("visible", false);
}

function addHover(selection, html) {
  selection
    .on("mouseenter", function (event, d) {
      d3.select(this).classed("active", true);
      showTooltip(event, html(d));
    })
    .on("mousemove", moveTooltip)
    .on("mouseleave", function () {
      d3.select(this).classed("active", false);
      hideTooltip();
    });
}

function createSvg(container, width, height) {
  if (!has(container)) return null;
  return d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img");
}

function legend(container, labels, classPrefix) {
  if (!has(container)) return;
  const items = d3.select(container).selectAll("li").data(labels).join("li");
  items.append("span").attr("class", (d, i) => `swatch ${classPrefix}-${i}`);
  items.append("span").text((d) => d);
}

function truncate(text, max) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

// ---------- 1. Bar chart: most exposed occupations ----------

function barChart(data) {
  const width = 900;
  const margin = { top: 10, right: 30, bottom: 40, left: 330 };
  const height = margin.top + margin.bottom + data.length * 28;

  const svg = createSvg("#chart-bar", width, height);
  if (!svg) return;
  svg.attr("aria-label", "Bar chart of the 15 occupations with the highest observed AI exposure");

  const x = d3.scaleLinear().domain([0, 0.8]).range([margin.left, width - margin.right]);
  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.title))
    .range([margin.top, height - margin.bottom])
    .padding(0.25);

  svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(8).tickSize(-(height - margin.top - margin.bottom)).tickFormat(""));

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(8));

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(0).tickPadding(8).tickFormat((d) => truncate(d, 48)));

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width - margin.right)
    .attr("y", height - 6)
    .attr("text-anchor", "end")
    .text("Observed exposure score (0 to 1)");

  svg
    .append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", "bar mark")
    .attr("x", x(0))
    .attr("y", (d) => y(d.title))
    .attr("width", (d) => x(d.observed_exposure) - x(0))
    .attr("height", y.bandwidth())
    .attr("rx", 3)
    .call(addHover, (d) => `<strong>${d.title}</strong>Exposure score: ${d.observed_exposure.toFixed(2)}`);
}

// ---------- 2. Grouped bar chart: adoption by enterprise size ----------

function groupedBarChart(data) {
  if (!has("#chart-grouped")) return;

  const width = 900;
  const height = 420;
  const margin = { top: 20, right: 10, bottom: 50, left: 50 };

  // Sort countries by adoption among large enterprises
  const countries = d3
    .groups(data, (d) => d.country)
    .sort((a, b) => d3.descending(
      a[1].find((d) => d.size === SIZES[2]).value,
      b[1].find((d) => d.size === SIZES[2]).value,
    ))
    .map(([country]) => country);

  legend("#legend-size", SIZES, "size");

  const svg = createSvg("#chart-grouped", width, height);
  svg.attr("aria-label", "Grouped bar chart of AI adoption by enterprise size and country, 2025");

  const x0 = d3.scaleBand().domain(countries).range([margin.left, width - margin.right]).paddingInner(0.2);
  const x1 = d3.scaleBand().domain(SIZES).range([0, x0.bandwidth()]).padding(0.08);
  const y = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);

  svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickSize(-(width - margin.left - margin.right)).tickFormat(""));

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d}%`));

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x0).tickSize(0).tickPadding(8));

  svg
    .append("g")
    .selectAll("g")
    .data(countries)
    .join("g")
    .attr("transform", (c) => `translate(${x0(c)},0)`)
    .selectAll("rect")
    .data((c) => data.filter((d) => d.country === c))
    .join("rect")
    .attr("class", (d) => `mark size-${SIZES.indexOf(d.size)}`)
    .attr("x", (d) => x1(d.size))
    .attr("y", (d) => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", (d) => y(0) - y(d.value))
    .attr("rx", 2)
    .call(addHover, (d) => `<strong>${d.country}</strong>${d.size}: ${pct(d.value)} of enterprises use AI`);
}

// ---------- 3. Heatmap: adoption by country and year ----------

function heatmap(data) {
  if (!has("#chart-heatmap")) return;

  const years = [...new Set(data.map((d) => d.year))].sort();
  const latest = d3.max(years);
  const countries = d3
    .groups(data, (d) => d.country)
    .sort((a, b) => d3.descending(
      a[1].find((d) => d.year === latest)?.value ?? -1,
      b[1].find((d) => d.year === latest)?.value ?? -1,
    ))
    .map(([country]) => country);

  const bin = d3.scaleThreshold().domain(HEAT_BINS).range(d3.range(HEAT_BINS.length + 1));
  const binLabels = ["under 5%"]
    .concat(HEAT_BINS.slice(0, -1).map((t, i) => `${t}–${HEAT_BINS[i + 1]}%`))
    .concat([`${HEAT_BINS[HEAT_BINS.length - 1]}% or more`]);
  legend("#legend-heat", binLabels, "heat");

  const cellH = 22;
  const margin = { top: 30, right: 10, bottom: 10, left: 110 };
  const width = 600;
  const height = margin.top + margin.bottom + countries.length * cellH;

  const svg = createSvg("#chart-heatmap", width, height);
  svg.attr("aria-label", "Heatmap of AI adoption in European enterprises by country and year");

  const x = d3.scaleBand().domain(years).range([margin.left, width - margin.right]).padding(0.06);
  const y = d3.scaleBand().domain(countries).range([margin.top, height - margin.bottom]).padding(0.08);

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).tickSize(0).tickPadding(6))
    .call((g) => g.select(".domain").remove());

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(0).tickPadding(6))
    .call((g) => g.select(".domain").remove());

  svg
    .append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", (d) => `mark ${d.value == null ? "heat-missing" : `heat-${bin(d.value)}`}`)
    .attr("x", (d) => x(d.year))
    .attr("y", (d) => y(d.country))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("rx", 2)
    .call(addHover, (d) => `<strong>${d.country}, ${d.year}</strong>${d.value == null ? "No data" : `${pct(d.value)} of enterprises use AI`}`);
}

// ---------- 4. 100% stacked bar chart: exposure by country ----------

function stackedBarChart(data) {
  if (!has("#chart-stacked")) return;

  const rows = d3
    .groups(data, (d) => d.country)
    .map(([country, values]) => {
      const row = { country, year: values[0].year };
      values.forEach((v) => (row[v.category] = v.share));
      return row;
    })
    // Countries with the largest share in the two most exposed gradients first
    .sort((a, b) => d3.descending(a[EXPOSURE[4]] + a[EXPOSURE[5]], b[EXPOSURE[4]] + b[EXPOSURE[5]]));

  legend("#legend-exposure", EXPOSURE, "exp");

  const width = 900;
  const margin = { top: 10, right: 20, bottom: 40, left: 160 };
  const height = margin.top + margin.bottom + rows.length * 30;

  const svg = createSvg("#chart-stacked", width, height);
  svg.attr("aria-label", "100% stacked bar chart of employment by generative AI exposure, by country");

  const series = d3.stack().keys(EXPOSURE)(rows);
  const x = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
  const y = d3
    .scaleBand()
    .domain(rows.map((d) => d.country))
    .range([margin.top, height - margin.bottom])
    .padding(0.22);

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat((d) => `${d}%`));

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(0).tickPadding(8).tickFormat((c) => {
      const row = rows.find((r) => r.country === c);
      return `${c} (${row.year})`;
    }))
    .call((g) => g.select(".domain").remove());

  svg
    .append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("class", (s, i) => `exp-${i}`)
    .selectAll("rect")
    .data((s) => s.map((d) => ({ ...d, key: s.key })))
    .join("rect")
    .attr("class", "mark")
    .attr("x", (d) => x(d[0]))
    .attr("y", (d) => y(d.data.country))
    // 2px gap between segments
    .attr("width", (d) => Math.max(0, x(d[1]) - x(d[0]) - 2))
    .attr("height", y.bandwidth())
    .call(addHover, (d) => `<strong>${d.data.country} (${d.data.year})</strong>${d.key}: ${pct(d.data[d.key])} of employment`);
}

// ---------- 5. Waffle chart: exposure of women vs men ----------

// Round shares to whole squares so each waffle has exactly 100
function toSquares(values) {
  const floors = values.map((v) => Math.floor(v.share));
  let remaining = 100 - d3.sum(floors);
  const order = values
    .map((v, i) => ({ i, rest: v.share - floors[i] }))
    .sort((a, b) => b.rest - a.rest);
  for (const { i } of order) {
    if (remaining <= 0) break;
    floors[i] += 1;
    remaining -= 1;
  }
  return values.flatMap((v, i) => d3.range(floors[i]).map(() => v));
}

function waffleChart(data) {
  if (!has("#chart-waffle")) return;

  const groups = ["Women", "Men"];
  const size = 24;
  const gap = 3;
  const gridSize = 10 * size + 9 * gap;
  const spacing = 80;
  const top = 34;
  const width = groups.length * gridSize + spacing;
  const height = top + gridSize + 4;

  legend("#legend-waffle", EXPOSURE, "exp");

  const svg = createSvg("#chart-waffle", width, height);
  svg.attr("aria-label", "Waffle charts comparing AI exposure of employed women and men in France");

  groups.forEach((group, gi) => {
    const values = EXPOSURE.map((category) => data.find((d) => d.sex === group && d.category === category));
    const squares = toSquares(values);
    const g = svg.append("g").attr("transform", `translate(${gi * (gridSize + spacing)},0)`);

    g.append("text").attr("class", "waffle-title").attr("x", 0).attr("y", 20).text(group);

    g.selectAll("rect")
      .data(squares)
      .join("rect")
      .attr("class", (d) => `mark exp-${EXPOSURE.indexOf(d.category)}`)
      .attr("x", (d, i) => (i % 10) * (size + gap))
      .attr("y", (d, i) => top + Math.floor(i / 10) * (size + gap))
      .attr("width", size)
      .attr("height", size)
      .attr("rx", 3)
      .call(addHover, (d) => `<strong>${d.sex}, ${d.country} ${d.year}</strong>${d.category}: ${pct(d.share)}`);
  });
}

// ---------- Load data ----------

const num = (d) => {
  for (const key of ["value", "share", "observed_exposure", "year"]) {
    if (key in d) d[key] = d[key] === "" ? null : +d[key];
  }
  return d;
};

const load = (file) => d3.csv(`${DATA_ROOT}/${file}`, num);

Promise.all([
  has("#chart-bar") ? load("job_exposure_top15.csv") : Promise.resolve(null),
  has("#chart-grouped") ? load("eurostat_ai_adoption_by_size.csv") : Promise.resolve(null),
  has("#chart-heatmap") ? load("eurostat_ai_adoption_by_year.csv") : Promise.resolve(null),
  has("#chart-stacked") ? load("ilo_exposure_by_country.csv") : Promise.resolve(null),
  has("#chart-waffle") ? load("ilo_exposure_by_sex.csv") : Promise.resolve(null),
]).then(([jobs, bySize, byYear, byCountry, bySex]) => {
  if (jobs) barChart(jobs);
  if (bySize) groupedBarChart(bySize);
  if (byYear) heatmap(byYear);
  if (byCountry) stackedBarChart(byCountry);
  if (bySex) waffleChart(bySex);
});
