import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'

export const useTripStore = defineStore('tripStore', () => {
    const trips = reactive([
        {
            id: 1,
            title: '東京自由行',
            startDate: '2025-06-01',
            endDate: '2025-06-05',
            cover: 'https://via.placeholder.com/600x300/cccccc/ffffff?text=Tokyo',
            notes: '這次旅程重點是美食與購物。',
            days: [
                { date: '2025-06-01', note: '抵達東京，入住飯店。' },
                { date: '2025-06-02', note: '古蹟、晴空塔觀光。' },
                { date: '2025-06-03', note: '迪士尼樂園一日遊。' },
                { date: '2025-06-04', note: '銀座購物，晚上賞夜景。' },
                { date: '2025-06-05', note: '回國準備。' },
            ],
        },
        {
            id: 2,
            title: '京都文化之旅',
            startDate: '2025-07-10',
            endDate: '2025-07-15',
            cover: 'https://via.placeholder.com/600x300/cccccc/ffffff?text=Kyoto',
            notes: '參觀古蹟與茶道體驗。',
            days: [
                { date: '2025-07-10', note: '抵達京都，參觀古蹟。' },
                { date: '2025-07-11', note: '嵐山竹林漫步。' },
                { date: '2025-07-12', note: '茶道體驗與和服試穿。' },
                { date: '2025-07-13', note: '參觀。' },
                { date: '2025-07-14', note: '自由活動，品嚐美食。' },
                { date: '2025-07-15', note: '回國準備。' },
            ],
        },
    ]);

    const selectedTrip = ref(null);
    const selectedTripId = ref(null);

    function selectTrip(id) {
        const foundTrip = trips.find(t => t.id === id);
        selectedTrip.value = foundTrip ? JSON.parse(JSON.stringify(foundTrip)) : null;
        selectedTripId.value = id;
    }

    function setSelectedTrip(trip) {
        selectedTrip.value = trip ? JSON.parse(JSON.stringify(trip)) : null;
        selectedTripId.value = trip ? trip.id : null;
    }

    function addDay(tripId) {
        const trip = trips.find(t => t.id === tripId);
        if (trip) {
            const lastDay = trip.days[trip.days.length - 1];
            const newDate = new Date(lastDay.date);
            newDate.setDate(newDate.getDate() + 1);
            trip.days.push({
                date: newDate.toISOString().slice(0, 10),
                note: '',
            });
            trip.endDate = newDate.toISOString().slice(0, 10);

            if (selectedTrip.value && selectedTrip.value.id === tripId) {
                selectedTrip.value = JSON.parse(JSON.stringify(trip));
            }

            saveTrips();
        }
    }

    function updateTrip(updatedTrip) {
        const index = trips.findIndex(t => t.id === updatedTrip.id);
        if (index !== -1) {
            Object.assign(trips[index], updatedTrip);
            if (selectedTrip.value && selectedTrip.value.id === updatedTrip.id) {
                selectedTrip.value = JSON.parse(JSON.stringify(updatedTrip));
            }
            saveTrips();
        }
    }

    function updateTripField(tripId, field, value) {
        const trip = trips.find(t => t.id === tripId);
        if (trip) {
            trip[field] = value;
            if (selectedTrip.value && selectedTrip.value.id === tripId) {
                selectedTrip.value[field] = value;
            }
            saveTrips();
        }
    }

    function updateTripNotes(tripId, notes) {
        const trip = trips.find(t => t.id === tripId);
        if (trip) {
            trip.notes = notes;
            if (selectedTrip.value && selectedTrip.value.id === tripId) {
                selectedTrip.value.notes = notes;
            }
            saveTrips();
        }
    }

    function updateDailyNote(tripId, date, newNote) {
        const trip = trips.find(t => t.id === tripId);
        if (trip) {
            const day = trip.days.find(d => d.date === date);
            if (day) {
                day.note = newNote;
                if (selectedTrip.value && selectedTrip.value.id === tripId) {
                    const selectedDay = selectedTrip.value.days.find(d => d.date === date);
                    if (selectedDay) {
                        selectedDay.note = newNote;
                    }
                }
                saveTrips();
            }
        }
    }

    function load() {
        const savedTrips = localStorage.getItem('trips');
        if (savedTrips) {
            const parsedTrips = JSON.parse(savedTrips);
            trips.splice(0, trips.length, ...parsedTrips);
        }
    }

    function saveTrips() {
        localStorage.setItem('trips', JSON.stringify(trips));
    }

    watch(selectedTripId, (newId) => {
        localStorage.setItem('selectedTripId', newId);
    });

    const savedSelectedTripIdFromStorage = localStorage.getItem('selectedTripId');
    if (savedSelectedTripIdFromStorage) {
        selectedTripId.value = Number(savedSelectedTripIdFromStorage);
    }
    load();

    if (selectedTripId.value) {
        const found = trips.find(t => t.id === selectedTripId.value);
        selectedTrip.value = found ? JSON.parse(JSON.stringify(found)) : null;
    }


    return {
        trips,
        selectedTrip,
        selectedTripId,
        setSelectedTrip,
        selectTrip,
        addDay,
        updateTrip,
        updateTripField,
        updateTripNotes,
        updateDailyNote,
        load,
        saveTrips,
    };
});