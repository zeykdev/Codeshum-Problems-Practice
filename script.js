

function cleanCourseData(data) {
    let idSet = new Set();
    let nameSet = new Set();

    return data.map(course => {
        const cleanedLessons = course.university_lessons.map(lesson => {
            const filteredTopics = lesson.university_topics.filter(topic => {
                if (!idSet.has(topic.id) && !nameSet.has(topic.name)) {
                    idSet.add(topic.id);
                    nameSet.add(topic.name);
                    return true;
                }
                return false;
            });

            filteredTopics.sort((a, b) => a.name.localeCompare(b.name));

            return {
                ...lesson,
                university_topics: filteredTopics
            };
        }).filter(lesson => lesson.university_topics.length > 0);

        return {
            ...course,
            university_lessons: cleanedLessons
        };
    });
}

function renderContent(filteredData) {
    let contentHTML = "";

    $.each(filteredData, function (index, course) {
        $.each(course.university_lessons, function (index, category) {
            let accordions = "";

            $.each(category.university_topics, function (i, topic) {
                if (topic.practice_problems.length !== 0) {
                    let links = topic.practice_problems.map(function (problem) {
                        return `<a class="btn m-1 btn-outline btn-sm" target="_blank" href="https://citu.codechum.com/student/study-area/${problem.id}">${problem.name}</a>`;
                    }).join("");

                    accordions += `
                            <div class="collapse collapse-arrow rounded-box bg-base-100">
                                <input type="checkbox" id="acc${topic.id}">
                                <div class="collapse-title text-xl font-medium">${topic.name} <span class="badge badge-ghost">${topic.practice_problems.length} Items</span></div>
                                <div class="collapse-content">
                                    <ul class="list-disc ml-5">
                                        ${links}
                                    </ul>
                                </div>
                            </div>`;
                }
            });

            if (accordions) {
                contentHTML += `
                        <div class="card bg-base-200 shadow-xl">
                            <div class="card-body">
                                <div class="divider text-4xl">
                                    ${category.name}
                                </div>
                                ${accordions}
                            </div>
                        </div>
                    `;
            }
        });
    });

    $('#content').html(contentHTML);
}

function filterCourseData(data, query, exactMatch = false) {
    return data.map(course => {
        const filteredLessons = course.university_lessons.map(lesson => {
            const filteredTopics = lesson.university_topics.map(topic => {
                const filteredProblems = topic.practice_problems.filter(problem =>
                    exactMatch ? problem.name === query : problem.name.toLowerCase().includes(query)
                );
                return {
                    ...topic,
                    practice_problems: filteredProblems
                };
            }).filter(topic => topic.practice_problems.length > 0);
            return {
                ...lesson,
                university_topics: filteredTopics
            };
        }).filter(lesson => lesson.university_topics.length > 0);
        return {
            ...course,
            university_lessons: filteredLessons
        };
    }).filter(course => course.university_lessons.length > 0);
}