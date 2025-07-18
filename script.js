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
        "pageLength": 5, // По умолчанию показывать 5 строк
        "lengthMenu": [ [5, 10, 25, -1], [5, 10, 25, "Все"] ], // Выбор кол-ва строк
        "autoWidth": true,
        "searching": true, // Включаем поиск
        "paging": true, // Включаем пагинацию
        "info": true, // Включаем информацию о строках
    };

    // Инициализация каждой таблицы с общими настройками
    $('#twitchTable').DataTable(dataTableOptions);
    $('#telegramTable').DataTable(dataTableOptions);
    $('#discordTable').DataTable(dataTableOptions);

});