ㅌㅊput = document.querySelector("#create-memo");
  const btnCreateSession = document.querySelector("#btn-create-session");
  const exerciseNameInput = document.querySelector("#exercise-name");
  const exerciseBodyPartInput = document.querySelector("#exercise-body-part");
  const exerciseBrandInput = document.querySelector("#exercise-brand");
  const exerciseStartInput = document.querySelector("#exercise-start");
  const btnCreateExercise = document.querySelector("#btn-create-exercise");

  const sessions = [
    {
      id: "session-2026-04-08",
      date: "2026-04-08",
      title: "2026-04-08 운동",
      memo: "가슴 + 어깨 중심, 탑세트 후 백오프",
      workouts: [
        {
          name: "해머 인클라인 프레스",
          start: "3.6kg",
          sets: [
            "원판 0kg x 15회 x 1세트",
            "원판 2.5kg(양쪽) x 15회 x 2세트",
            "원판 0kg x 20회 x 1세트",
          ],
        },
        {
          name: "해머 숄더프레스",
          start: "4.5kg",
          sets: ["원판 0kg x 15회 x 3세트"],
        },
      ],
    },
    {
      id: "session-2026-04-06",
      date: "2026-04-06",
      title: "푸시 데이",
      memo: "디클라인/와이드 체스트 중심, 마지막 백오프 포함",
      workouts: [
        {
          name: "해머 와이드 체스트",
          start: "0.9kg",
          sets: [
            "원판 2.5kg(양쪽) x 15회 x 2세트",
            "원판 5kg(양쪽) x 15회 x 1세트",
            "원판 2.5kg(양쪽) x 15회 x 1세트",
          ],
        },
        {
          name: "해머 디클라인 프레스",
          start: "2.7kg",
          sets: [
            "원판 0kg x 15회 x 1세트",
            "원판 2.5kg(양쪽) x 15회 x 1세트",
            "원판 5kg(양쪽) x 15회 x 1세트",
            "원판 2.5kg(양쪽) x 10회 x 1세트",
          ],
        },
      ],
    },
  ];

  const exercises = [
    { name: "해머 인클라인 프레스", bodyPart: "가슴", brand: "Hammer Strength", start: "3.6kg" },
    { name: "해머 와이드 체스트", bodyPart: "가슴", brand: "Hammer Strength", start: "0.9kg" },
  ];

  let selectedSessionId = sessions[0].id;

  const getSessionById = (sessionId) => sessions.find((session) => session.id === sessionId);
  const countSets = (workouts) =>
    workouts.reduce((sum, workout) => sum + workout.sets.length, 0);

  const activateScreen = (targetId) => {
    tabs.forEach((item) => {
      const isTargetTab = item.dataset.target === targetId;
      item.classList.toggle("is-active", isTargetTab);
    });

    screens.forEach((screen) => {
      const isTargetScreen = screen.id === targetId;
      screen.classList.toggle("is-active", isTargetScreen);
    });
  };

  const renderSessionList = () => {
    const sortedSessions = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
    if (sortedSessions.length === 0) {
      sessionList.innerHTML = `<article class="card"><p>아직 기록된 세션이 없습니다.</p></article>`;
      return;
    }

    const listHtml = sortedSessions
      .map((session) => {
        const setsCount = countSets(session.workouts);
        return `
          <article class="card session-card" data-session-id="${session.id}">
            <div class="row between">
              <strong>${session.title}</strong>
              <button type="button" class="link-btn delete-session-btn">삭제</button>
            </div>
            <p>${session.date} · 종목 ${session.workouts.length}개 · 세트 ${setsCount}개</p>
            <button type="button" class="link-btn detail-btn">상세 보기</button>
          </article>
        `;
      })
      .join("");

    sessionList.innerHTML = listHtml;
  };

  const renderExerciseList = () => {
    if (exercises.length === 0) {
      exerciseList.innerHTML = `<article class="card"><p>등록된 종목이 없습니다.</p></article>`;
      return;
    }

    const listHtml = exercises
      .map((exercise) => {
        const brand = exercise.brand ? ` (${exercise.brand})` : "";
        const start = exercise.start ? `<p class="hint">기본 저항 ${exercise.start}</p>` : "";
        return `
          <article class="card">
            <p><strong>${exercise.name}</strong>${brand}</p>
            <p class="hint">부위: ${exercise.bodyPart}</p>
            ${start}
          </article>
        `;
      })
      .join("");

    exerciseList.innerHTML = listHtml;
  };

  const renderSessionDetail = (sessionId) => {
    const selected = getSessionById(sessionId);
    if (!selected) return;

    selectedSessionId = selected.id;
    detailDate.textContent = selected.date;
    detailTitle.textContent = selected.title;
    detailMemo.textContent = selected.memo;

    const workoutHtml = selected.workouts
      .map((workout) => {
        const setsHtml = workout.sets.map((set) => `<li>${set}</li>`).join("");
        return `
          <article class="card">
            <h3>${workout.name}</h3>
            <p class="hint">Start ${workout.start}</p>
            <ul>${setsHtml}</ul>
          </article>
        `;
      })
      .join("");

    detailWorkouts.innerHTML = workoutHtml || `<article class="card"><p>아직 등록된 운동이 없습니다.</p></article>`;
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateScreen(tab.dataset.target);
    });
  });

  sessionList.addEventListener("click", (event) => {
    const sessionCard = event.target.closest(".session-card");
    if (!sessionCard) return;

    const sessionId = sessionCard.dataset.sessionId;

    if (event.target.closest(".delete-session-btn")) {
      const shouldDelete = window.confirm("세션을 삭제할까요?");
      if (!shouldDelete) return;
      const index = sessions.findIndex((session) => session.id === sessionId);
      if (index >= 0) {
        sessions.splice(index, 1);
        if (selectedSessionId === sessionId && sessions.length > 0) {
          renderSessionDetail(sessions[0].id);
        }
      }
      renderSessionList();
      return;
    }

    renderSessionDetail(sessionId);
    activateScreen("screen-detail");
  });

  const setCreateDefaults = () => {
    const today = new Date().toISOString().slice(0, 10);
    createDateInput.value = today;
    createTitleInput.value = `${today} 운동`;
    createMemoInput.value = "";
  };

  createDateInput.addEventListener("change", () => {
    createTitleInput.value = `${createDateInput.value} 운동`;
  });

  btnGoCreate.addEventListener("click", () => {
    setCreateDefaults();
    activateScreen("screen-create");
  });

  btnCreateSession.addEventListener("click", () => {
    const date = createDateInput.value.trim();
    const title = createTitleInput.value.trim();
    const memo = createMemoInput.value.trim();

    if (!date) {
      window.alert("운동일을 입력해 주세요.");
      return;
    }
    if (!title) {
      window.alert("세션 제목을 입력해 주세요.");
      return;
    }

    const newSession = {
      id: `session-${Date.now()}`,
      date,
      title,
      memo,
      workouts: [],
    };

    sessions.push(newSession);
    renderSessionList();
    renderSessionDetail(newSession.id);
    activateScreen("screen-detail");
  });

  btnCreateExercise.addEventListener("click", () => {
    const name = exerciseNameInput.value.trim();
    const bodyPart = exerciseBodyPartInput.value.trim();
    const brand = exerciseBrandInput.value.trim();
    const start = exerciseStartInput.value.trim();

    if (!name || !bodyPart) {
      window.alert("종목 이름과 부위는 필수입니다.");
      return;
    }

    exercises.push({ name, bodyPart, brand, start });
    renderExerciseList();

    exerciseNameInput.value = "";
    exerciseBodyPartInput.value = "";
    exerciseBrandInput.value = "";
    exerciseStartInput.value = "";
  });

  btnAddWorkout.addEventListener("click", () => {
    const session = getSessionById(selectedSessionId);
    if (!session) return;

    const name = window.prompt("추가할 종목 이름을 입력해 주세요.");
    if (!name) return;

    const fromLibrary = exercises.find((exercise) => exercise.name === name.trim());

    session.workouts.push({
      name: name.trim(),
      start: fromLibrary?.start || "",
      sets: [],
    });

    renderSessionList();
    renderSessionDetail(session.id);
  });

  btnAddSet.addEventListener("click", () => {
    const session = getSessionById(selectedSessionId);
    if (!session) return;

    if (session.workouts.length === 0) {
      window.alert("먼저 종목을 추가해 주세요.");
      return;
    }

    const workoutNames = session.workouts.map((workout, index) => `${index + 1}. ${workout.name}`).join("\n");
    const selectedIndexInput = window.prompt(
      `세트를 추가할 종목 번호를 입력해 주세요.\n${workoutNames}`,
      "1"
    );
    if (!selectedIndexInput) return;

    const workoutIndex = Number(selectedIndexInput) - 1;
    const targetWorkout = session.workouts[workoutIndex];
    if (!targetWorkout) {
      window.alert("올바른 종목 번호를 입력해 주세요.");
      return;
    }

    const plate = window.prompt("원판 무게를 입력해 주세요. (예: 2.5kg(양쪽), 0kg)");
    if (!plate) return;

    const reps = window.prompt("반복 횟수를 입력해 주세요. (예: 15)");
    if (!reps) return;

    const countInput = window.prompt("세트 개수를 입력해 주세요. (기본 1)", "1");
    const count = Math.max(1, Number(countInput || "1"));

    targetWorkout.sets.push(`원판 ${plate.trim()} x ${reps.trim()}회 x ${count}세트`);

    renderSessionList();
    renderSessionDetail(session.id);
  });

  setCreateDefaults();
  renderSessionList();
  renderExerciseList();
  renderSessionDetail(selectedSessionId);

  const day18CountEl = document.querySelector("#day18-count");
  const day18CounterBtn = document.querySelector("#day18-counter-btn");
  const day18LiveInput = document.querySelector("#day18-live-input");
  const day18LiveMirror = document.querySelector("#day18-live-mirror");
  const day18ThemeSelect = document.querySelector("#day18-theme-select");

  let day18Count = 0;

  day18CounterBtn.addEventListener("click", () => {
    day18Count += 1;
    day18CountEl.textContent = String(day18Count);
  });

  day18LiveInput.addEventListener("input", () => {
    const value = day18LiveInput.value;
    day18LiveMirror.textContent = value.trim() === "" ? "(비어 있음)" : value;
  });

  day18ThemeSelect.addEventListener("change", () => {
    document.body.classList.remove("day18-theme-blue", "day18-theme-violet");
    if (day18ThemeSelect.value === "blue") {
      document.body.classList.add("day18-theme-blue");
    } else if (day18ThemeSelect.value === "violet") {
      document.body.classList.add("day18-theme-violet");
    }
  });

  // DAY18 직접 해보기
  const day18SelfReset = document.querySelector("#day18-self-reset");
  const day18SelfMinus = document.querySelector("#day18-self-minus");
  const day18SelfHideHint = document.querySelector("#day18-self-hide-hint");
  const day18SelfHint = document.querySelector("#day18-self-hint");

  day18SelfReset.addEventListener("click", () => {
    day18Count = 0;
    day18CountEl.textContent = "0";
  });

  day18SelfMinus.addEventListener("click", () => {
    if (day18Count > 0) {
      day18Count -= 1;
      day18CountEl.textContent = String(day18Count);
    }
  });

  day18SelfHideHint.addEventListener("change", () => {
    if (day18SelfHideHint.checked) {
      day18SelfHint.classList.add("is-hidden");
    } else {
      day18SelfHint.classList.remove("is-hidden");
    }
  });

  const day19Form = document.querySelector("#day19-signup-form");
  const day19Name = document.querySelector("#day19-name");
  const day19Email = document.querySelector("#day19-email");
  const day19FormError = document.querySelector("#day19-form-error");
  const day19FormSuccess = document.querySelector("#day19-form-success");

  day19Form.addEventListener("submit", (event) => {
    event.preventDefault();

    day19FormError.classList.add("is-hidden");
    day19FormSuccess.classList.add("is-hidden");
    day19FormError.textContent = "";

    const name = day19Name.value.trim();
    const email = day19Email.value.trim();

    if (name === "" || email === "") {
      day19FormError.textContent = "이�일을 모두 입력해 주세요.";
      day19FormError.classList.remove("is-hidden");
      return;
    }

    if (!email.includes("@")) {
      day19FormError.textContent = "이메일에 @가 포함되어야 ��니다.";
      day19FormError.classList.remove("is-hidden");
      return;
    }

    console.log("DAY19 제출:", { name, email });
    day19FormSuccess.textContent = `�: ${name} / ${email}`;
    day19FormSuccess.classList.remove("is-hidden");
    day19Form.reset();
  });
});
