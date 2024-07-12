package com.boxoalnative2;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import android.content.Intent;
import android.os.Bundle;
import javax.annotation.Nullable;

public class BackgroundHeadlessTaskService extends HeadlessJsTaskService {
    @Override
    protected @Nullable
    HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createChannel();
            Notification notification = new NotificationCompat.Builder(getApplicationContext(), "foregroundServiceNotification")
                    .setContentTitle("Boxoal started recording")
                    .setTicker("runn")
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setOngoing(false)
                    .build();
            startForeground(1, notification);
        }

        Bundle extras = intent.getExtras();
        if (extras != null) {
            return new HeadlessJsTaskConfig(
                    "BackgroundHeadlessTask",
                    Arguments.fromBundle(extras),
                    20000, 
                    true 
            );
        }
        return null;
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private void createChannel() {
        String description = "Initial notification, to be ignored";
        int importance = NotificationManager.IMPORTANCE_DEFAULT;
        NotificationChannel channel = new NotificationChannel("foregroundServiceNotification", "foregroundServiceNotification", importance);
        channel.setDescription(description);
        NotificationManager notificationManager =
                (NotificationManager) getApplicationContext().getSystemService(NOTIFICATION_SERVICE);

        notificationManager.createNotificationChannel(channel);

    } 
}
