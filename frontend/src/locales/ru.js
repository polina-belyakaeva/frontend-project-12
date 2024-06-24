const ru = {
  translation: {
    header: {
      title: "Hexlet Chat",
      logout: "Выйти",
    },
    loginPage: {
      login: "Войти",
      imgAlt: "Тота на вершине горы",
      nickname: "Ваш ник",
      password: "Пароль",
      footer: {
        isAccountExist: "Нет аккаунта?",
        signup: "Регистрация",
      },
    },
    signupPage: {
      signupTitle: "Регистрация",
      imgAlt: "Тота радуется на фоне фейерверков",
      username: "Имя пользователя",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      signup: "Зарегистрироваться",
    },
    notFoundPage: {
      notFound: "Страница не найдена",
      redirectToSignup: "Но вы можете перейти на",
      mainPage: "главную страницу",
    },
    chat: {
      typeMessage: "Введите сообщение...",
      loading: "Загружаем данные",
    },
    channels: {
      channels: "Каналы",
      delete: "Удалить",
      edit: "Переименовать",
      addChannel: "+",
      modal: {
        modalAddChannel: "Добавить канал",
        modalCancel: "Отменить",
        modalSend: "Отправить",
        deleteChannel: "Удалить канал",
        modalClose: "Закрыть",
        sure: "Уверены?",
        editChannel: "Переименовать канал",
        channelName: "Имя канала",
        channelManagment: "Управление каналом",
      },
    },
    messages: {
      key_one: "{{count}} сообщение",
      key_few: "{{count}} сообщения",
      key_many: "{{count}} сообщений",
      send: "Отправить",
      newMessage: "Новое сообщение",
    },
    notification: {
      channelIsCreated: "Канал создан",
      channelIsDeleted: "Канал удалён",
      channelIsRenamed: "Канал переименован",
      networkErrorToast: "Ошибка соединения",
    },
    form: {
      errors: {
        required: "Обязательное поле",
        wrongNicknameorPassword: "Неверные имя пользователя или пароль",
        unknown: "Неизвестная ошибка",
        network: "Ошибка соединения",
        min: "От 3 до 20 символов",
        minPassword: "Не менее 6 символов",
        max: "От 3 до 20 символов",
        unique: "Должно быть уникальным",
        samePasswords: "Пароли должны совпадать",
        usernameTaken: "Такой пользователь уже существует",
      },
    },
  },
};

export default ru;
