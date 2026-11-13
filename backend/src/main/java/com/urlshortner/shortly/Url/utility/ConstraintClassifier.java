package com.urlshortner.shortly.Url.utility;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.stereotype.Component;

@Component
public class ConstraintClassifier {

    private static final String SHORT_CODE_CONSTRAINT =
            "uk_url_short_code";

    public boolean isShortCodeConflict(Throwable exception) {

        Throwable current = exception;

        while (current != null) {

            if (current instanceof
                    org.hibernate.exception.ConstraintViolationException cve) {

                String constraintName = cve.getConstraintName();

                if (constraintName != null) {

                    return constraintName.endsWith(
                            SHORT_CODE_CONSTRAINT
                    );
                }
            }

            current = current.getCause();
        }

        return false;
    }
}
