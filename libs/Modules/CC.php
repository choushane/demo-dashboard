<?php

    namespace Modules;

    class CC extends \ld\Modules\Module {
        protected $name = 'CC';
        protected $raw_output = true;

        public function getData($args=array()) {
			$data = array();
			
	    exec(
                "/usr/bin/sar -P ALL 0 |sed -n '5,6p'|awk '{print $2,$8}'",
                $result
            );
	    //return shell_exec('/bin/cat /home/linaro/003/oo.log');

            $result = array_filter($result);

		foreach ($result as $a) {
		$p = explode(' ', $a);

                $data[$p[0]] = $p[1];
            }
			
			return $data;
        }
    }
