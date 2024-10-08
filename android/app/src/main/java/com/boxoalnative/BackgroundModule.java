package com.boxoalnative;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.concurrent.TimeUnit;
import javax.annotation.Nonnull;
import androidx.work.Data;
import androidx.work.ExistingWorkPolicy;
import android.util.Log;
import androidx.work.OneTimeWorkRequest;

public class BackgroundModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "BackgroundWorkManager";

    private Context mContext;
    private OneTimeWorkRequest workRequest;

    BackgroundModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @ReactMethod
    public void startBackgroundWork(String timebox, String schedule, String recordingStartTime) {
        Data serviceInput = new Data.Builder().putString("timebox", timebox).putString("schedule", schedule).putString("recordingStartTime", recordingStartTime).build();
        workRequest = new OneTimeWorkRequest.Builder(BackgroundWorker.class).setInputData(serviceInput).build();
        WorkManager.getInstance(mContext).enqueueUniqueWork("recordingUpdate", ExistingWorkPolicy.REPLACE, workRequest);
    }

    @ReactMethod
    public void stopBackgroundWork() {
        WorkManager.getInstance(mContext).cancelUniqueWork("recordingUpdate");
    }

    @Nonnull
    @Override
    public String getName() {
        return MODULE_NAME;
    }
}