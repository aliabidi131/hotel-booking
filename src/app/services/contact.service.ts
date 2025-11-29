// ============================================
// 📧 CONTACT SERVICE - With Email Notifications
// ============================================
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: 'unread' | 'read' | 'replied';
  createdAt?: Date;
}

interface EmailResult {
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private supabase = inject(SupabaseService).supabase;

  /**
   * Send a contact message and trigger email notification
   */
  async sendMessage(contact: ContactMessage): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Save to database
      const { data, error } = await this.supabase
        .from('contacts')
        .insert({
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
          status: 'unread',
          createdAt: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving contact:', error);
        return { success: false, message: 'Failed to send message: ' + error.message };
      }

      // 2. Send email notification via Edge Function
      const emailResult = await this.sendEmailNotification(contact);
      
      if (!emailResult.success) {
        console.warn('Email notification failed, but message was saved:', emailResult.error);
      }

      return { 
        success: true, 
        message: 'Message sent successfully! We\'ll get back to you soon.' 
      };

    } catch (error: any) {
      console.error('Contact error:', error);
      return { success: false, message: 'Error: ' + error.message };
    }
  }

  /**
   * Call Edge Function to send email notification
   */
  private async sendEmailNotification(contact: ContactMessage): Promise<EmailResult> {
    try {
      const { data, error } = await this.supabase.functions.invoke('send-email', {
        body: {
          type: 'contact',
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message
        }
      });

      if (error) {
        console.error('Email notification error:', error);
        return { success: false, error: error.message };
      }

      console.log('Email notification sent:', data);
      return { success: true };

    } catch (error: any) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all contact messages (for admin)
   */
  async getAllMessages(): Promise<ContactMessage[]> {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }

    return data as ContactMessage[];
  }

  /**
   * Mark message as read
   */
  async markAsRead(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('contacts')
      .update({ status: 'read' })
      .eq('id', id);

    if (error) console.error('Error marking as read:', error);
  }

  /**
   * Mark message as replied
   */
  async markAsReplied(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('contacts')
      .update({ 
        status: 'replied', 
        repliedAt: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) console.error('Error marking as replied:', error);
  }

  /**
   * Delete a message
   */
  async deleteMessage(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting message:', error);
  }

  /**
   * Get count of unread messages
   */
  async getUnreadCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from('contacts')
      .select('id', { count: 'exact' })
      .eq('status', 'unread');

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }

    return count || 0;
  }
}
