package com.boxoalnative2;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import android.util.Log;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import android.content.Context;
import androidx.annotation.NonNull;
import android.os.Bundle;
import android.content.Intent;
import android.os.Build;
import androidx.work.Data;

public class BackgroundWorker extends Worker {
    private final Context context;
    private Data inputData;

    public BackgroundWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        this.inputData = workerParams.getInputData();
        this.context = context;
    }

    @NonNull
    @Override
    public Result doWork() {

        // background work will take place here
    
        Bundle extras = new Bundle();
        extras.putString("timebox", inputData.getString("timebox"));
        extras.putString("schedule", inputData.getString("schedule"));
        extras.putString("recordingStartTime", inputData.getString("recordingStartTime"));
        Intent service = new Intent(this.context, BackgroundHeadlessTaskService.class);
        service.putExtras(extras);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            this.context.startForegroundService(service);
        } else {
            this.context.startService(service);
        }
        
        return Result.success();


    }
}