// relay.js
const questionsData = { "affirmative": [], "negative": [], "interrogative": [], "short": [] };

const baseVerbs = [
    { base: "play", s: "plays", objSing: "football", objPlur: "video games" },
    { base: "watch", s: "watches", objSing: "TV", objPlur: "movies" },
    { base: "go", s: "goes", objSing: "to school", objPlur: "to the gym" },
    { base: "study", s: "studies", objSing: "English", objPlur: "history" },
    { base: "like", s: "likes", objSing: "pizza", objPlur: "burgers" },
    { base: "speak", s: "speaks", objSing: "French", objPlur: "Spanish" },
    { base: "read", s: "reads", objSing: "books", objPlur: "magazines" },
    { base: "listen", s: "listens", objSing: "to music", objPlur: "to podcasts" },
    { base: "wash", s: "washes", objSing: "the car", objPlur: "the dishes" },
    { base: "live", s: "lives", objSing: "in London", objPlur: "in Paris" },
    { base: "work", s: "works", objSing: "at a school", objPlur: "in an office" },
    { base: "drive", s: "drives", objSing: "a car", objPlur: "a truck" },
    { base: "run", s: "runs", objSing: "fast", objPlur: "every morning" },
    { base: "eat", s: "eats", objSing: "chocolate", objPlur: "vegetables" },
    { base: "drink", s: "drinks", objSing: "milk", objPlur: "soda" },
    { base: "cook", s: "cooks", objSing: "dinner", objPlur: "great meals" },
    { base: "clean", s: "cleans", objSing: "the room", objPlur: "the house" },
    { base: "write", s: "writes", objSing: "emails", objPlur: "stories" },
    { base: "sing", s: "sings", objSing: "pop songs", objPlur: "songs" },
    { base: "dance", s: "dances", objSing: "hip-hop", objPlur: "salsa" },
    { base: "teach", s: "teaches", objSing: "math", objPlur: "languages" },
    { base: "fly", s: "flies", objSing: "a drone", objPlur: "kites" },
    { base: "travel", s: "travels", objSing: "to Europe", objPlur: "around the world" },
    { base: "buy", s: "buys", objSing: "new clothes", objPlur: "shoes" },
    { base: "paint", s: "paints", objSing: "pictures", objPlur: "walls" }
];

const subjectsSingular3rd = ["He", "She", "It", "Tom", "Sarah", "The cat", "My brother", "The teacher", "My mom", "Alex"];
const subjectsOtherPersons = ["I", "You", "We", "They", "I", "You", "We", "They", "My friends", "The students"];

// 1. AFfIRMATIF (150)
for (let i = 0; i < 75; i++) {
    let sub = subjectsSingular3rd[i % subjectsSingular3rd.length]; let v = baseVerbs[i % baseVerbs.length];
    questionsData.affirmative.push({ text: `${sub} ... (${v.base}) ${v.objSing}.`, answer: v.s, rule: "3rd person singular (He/She/It) = add -s/-es." });
}
for (let i = 0; i < 75; i++) {
    let sub = subjectsOtherPersons[i % subjectsOtherPersons.length]; let v = baseVerbs[i % baseVerbs.length];
    questionsData.affirmative.push({ text: `${sub} ... (${v.base}) ${v.objPlur}.`, answer: v.base, rule: "With I/You/We/They, use the base form of the verb." });
}

// 2. NÉGATIF (150)
for (let i = 0; i < 75; i++) {
    let sub = subjectsSingular3rd[i % subjectsSingular3rd.length]; let v = baseVerbs[i % baseVerbs.length];
    questionsData.negative.push({ text: `${sub} ... (not / ${v.base}) ${v.objSing}.`, answer: `doesn't ${v.base}`, rule: "Singular negative: use 'doesn't' + base form." });
}
for (let i = 0; i < 75; i++) {
    let sub = subjectsOtherPersons[i % subjectsOtherPersons.length]; let v = baseVerbs[i % baseVerbs.length];
    questionsData.negative.push({ text: `${sub} ... (not / ${v.base}) ${v.objPlur}.`, answer: `don't ${v.base}`, rule: "Plural negative: use 'don't' + base form." });
}

// 3. INTERROGATIF (150)
for (let i = 0; i < 75; i++) {
    let sub = subjectsSingular3rd[i % subjectsSingular3rd.length]; let v = baseVerbs[i % baseVerbs.length];
    questionsData.interrogative.push({ text: `... ${sub.toLowerCase()} (${v.base}) ${v.objSing}?`, answer: `Does ${sub.toLowerCase()} ${v.base}`, rule: "Question singular: Does + subject + base form?" });
}
for (let i = 0; i < 75; i++) {
    let sub = subjectsOtherPersons[i % subjectsOtherPersons.length]; let v = baseVerbs[i % baseVerbs.length];
    questionsData.interrogative.push({ text: `... ${sub === "I" ? "I" : sub.toLowerCase()} (${v.base}) ${v.objPlur}?`, answer: `Do ${sub === "I" ? "I" : sub.toLowerCase()} ${v.base}`, rule: "Question plural: Do + subject + base form?" });
}

// 4. RÉPONSES BRÈVES (150)
const proSing = ["he", "she", "it"]; const proPlur = ["they", "we", "you"];
for (let i = 0; i < 75; i++) {
    let p = proSing[i % proSing.length]; let v = baseVerbs[i % baseVerbs.length];
    questionsData.short.push({ text: `Does ${p} ${v.base} ${v.objSing}? Yes, ${p} ...`, answer: "does", rule: "Affirmative short answer: use 'does'." });
}
for (let i = 0; i < 75; i++) {
    let p = proPlur[i % proPlur.length]; let v = baseVerbs[i % baseVerbs.length];
    questionsData.short.push({ text: `Do ${p} ${v.base} ${v.objPlur}? No, ${p} ...`, answer: "don't", rule: "Negative short answer: use 'don't'." });
}