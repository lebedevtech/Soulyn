import { supabase } from '../lib/supabase';
import WebApp from '@twa-dev/sdk';

export const authService = {
  // Главная функция входа
  async loginOrRegister() {
    let tgUser = null;

    // 1. Пытаемся получить данные из Телеграма
    if (WebApp.initDataUnsafe?.user) {
      tgUser = WebApp.initDataUnsafe.user;
    } else {
      // MOCK DATA для тестирования в браузере
      console.warn('Telegram SDK не найден. Используем тестовые данные.');
      tgUser = {
        id: 123456789,
        first_name: 'Эльвир (Тест)',
        username: 'elvir_test',
        photo_url: 'https://i.pravatar.cc/300',
        is_premium: true, // Тестируем как VIP
        language_code: 'ru'
      };
    }

    const tgIdString = String(tgUser.id);

    try {
      // 2. Ищем пользователя в базе
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('tg_id', tgIdString)
        .maybeSingle(); // maybeSingle не выдает ошибку, если пусто

      if (fetchError) throw fetchError;

      if (existingUser) {
        // СЦЕНАРИЙ А: Пользователь уже есть -> Обновляем дату входа
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ 
            last_active_at: new Date(),
            // Обновляем фото/имя, если они сменились в ТГ
            first_name: tgUser.first_name,
            username: tgUser.username,
            avatar_url: tgUser.photo_url,
            is_premium: tgUser.is_premium
          })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return updatedUser;
      } 
      
      else {
        // СЦЕНАРИЙ Б: Новый пользователь -> Регистрация
        const newUser = {
          tg_id: tgIdString,
          first_name: tgUser.first_name,
          username: tgUser.username,
          avatar_url: tgUser.photo_url,
          is_premium: tgUser.is_premium || false,
          club_status: tgUser.is_premium ? 'member' : 'guest', // Премиумы сразу получают статус
          entry_method: 'organic', 
          stars_balance: 0
        };

        const { data: createdUser, error: insertError } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single();

        if (insertError) throw insertError;
        return createdUser;
      }

    } catch (error) {
      console.error('Auth Error:', error);
      return null;
    }
  }
};