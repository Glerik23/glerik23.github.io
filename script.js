$(document).ready(function() {
    
    // Общие настройки для всех таблиц
    const dataTableOptions = {
        "language": {
            "search": "Поиск:",
            "lengthMenu": "Показать _MENU_ записей",
            "info": "Записи с _START_ до _END_ из _TOTAL_",
            "infoEmpty": "Нет записей",
            "infoFiltered": "(отфильтровано из _MAX_)",
            "zeroRecords": "Совпадений не найдено.",
            "emptyTable": "В таблице нет данных",
            "paginate": {
                "first": "«",
                "previous": "‹",
                "next": "›",
                "last": "»"
            }
        },
        "pageLength": 5,
        "lengthMenu": [ [5, 10, 25, -1], [5, 10, 25, "Все"] ],
        "autoWidth": true,
        "searching": true,
        "paging": true,
        "info": true,
    };

    $(document).ready(function() {
    // Опция order для таблицы Twitch
    $('#twitchTable').DataTable({
        "order": [[ 1, "desc" ]] // Сортировать по столбцу с индексом 1 (Followers) по убыванию
    });

    // Для остальных таблиц можно оставить стандартную инициализацию
    $('#telegramTable').DataTable({
        "order": [[ 1, "desc" ]] // Сортировать по столбцу с индексом 1 (Followers) по убыванию
    });
    $('#discordTable').DataTable({
        "order": [[ 1, "desc" ]] // Сортировать по столбцу с индексом 1 (Followers) по убыванию
    });
    });

});